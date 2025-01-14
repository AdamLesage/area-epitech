/*
** EPITECH PROJECT, 2024
** area-epitech
** File description:
** authentication
*/

const express = require('express');
// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();
const router = express.Router();
const passport = require('passport');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');
const axios = require('axios');

// Global variable for reset email code
let resetPasswordCodeAccordingToEmail = {
    "adamles44@gmail.com": 123456,
};

// Intern auth routes

router.post('/login', (req, res) => {
    const { password, email } = req.body;

    if (!password || !email) {
        return res.status(400).json({ error: 'Missing parameters' });
    }

    prisma.user.findUnique({
        where: {
            email,
        },
    }).then((user) => {
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        bcrypt.compare(password, user.hashedPassword, (err, result) => {
            if (result) {
                return res.status(200).json({ message: 'User logged in', user: user });
            }
            return res.status(401).json({ error: 'Invalid password' });
        });
    });
});

router.post('/register', async (req, res) => {
    const { password, email, name, surname, bio, birthDate, phoneNumber, profilePicture } = req.body;

    if (!password || !email) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const uuid = uuidv4();
    const authToken = uuidv4();

    prisma.user.create({
        data: {
            email,
            hashedPassword,
            name: name ? name : 'Invalid name',
            surname: surname ? surname : 'Invalid surname',
            bio,
            uuid: uuid,
            birthDate: birthDate ? new Date(birthDate) : null,
            phoneNumber,
            profilePicture: profilePicture ? { create: profilePicture } : undefined,
            authToken: authToken,
        },
    }).then((user) => {
        return res.status(201).json(user);
    }).catch((error) => {
        console.error(error);
        return res.status(500).json({ error: error.message });
    });
});

router.get('/logout', (req, res) => {
    const headers = req.headers;

    if (!headers.authorization) {
        return res.status(400).json({ error: 'Missing authorization header' });
    }

    prisma.user.findUnique({
        where: {
            authToken: headers.authorization,
        },
    }).then((user) => {
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                authToken: uuidv4(), // Invalidate the auth token
            },
        }).then(() => {
            return res.status(200).json({ message: 'User logged out' });
        }).catch((error) => {
            console.error(error);
            return res.status(500).json({ error: error.message });
        });
    });
});


router.post('/reset-password', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Check if user exists
    prisma.user.findUnique({
        where: {
            email: email,
        },
    }).then((user) => {
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
        // 6 digits code
        const code = Math.floor(100000 + Math.random() * 900000);

        const mailData = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Reset password for Area Romain le malin',
            text: `Your verification code is ${code}`,
        };

        // Send email with reset password link
        transporter.sendMail(mailData, (err, info) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: err.message });
            }
            // set the code for the email
            resetPasswordCodeAccordingToEmail[email] = code;

            return res.status(200).json({ message: `Email sent to ${email}` });
        }).catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.message });
        });
    }).catch((error) => {
        console.error(error);
        return res.status(500).json({ error: error.message });
    });
});

// Method /GET because user will click on the link
router.post('/reset-password-confirm', async (req, res) => {
    const { email, code } = req.body;

    if (!email || !code) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    if (resetPasswordCodeAccordingToEmail[email] === parseInt(code, 10)) {
        // Redirect to the reset password page
        return res.status(200).json({ message: 'Code is correct', redirectUrl: `/change-password?code=${code}` });
    } else {
        return res.status(400).json({ error: 'Code is incorrect' });
    }
});


router.put('/change-password', async (req, res) => {
    const { email, code, password } = req.body;

    if (!email || !code || !password) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    if (resetPasswordCodeAccordingToEmail[email] !== parseInt(code, 10)) {
        return res.status(400).json({ error: 'Code is incorrect' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    prisma.user.update({
        where: {
            email: email,
        },
        data: {
            hashedPassword: hashedPassword,
        },
    }).then(() => {
        return res.status(200).json({ message: 'Password updated', redirectUrl: '/dashboard' });
    }).catch((error) => {
        console.error(error);
        return res.status(500).json({ error: error.message });
    });
});

/**
 * Retrieves user information based on the request object.
 * @param {Object} req - The request object.
 * @returns {Promise<void>} - A promise that resolves with the user information.
 */
async function getUser(req) {
    if (req.user.sessionEmail != undefined) {
        // User is already logged in with primary email, we search the user from the sessionEmail
        const user = await prisma.user.findUnique({
            where: { email: req.user.sessionEmail },
            include: { linkedAccounts: true },
        });
        return user;
    } else {
        // User is not logged in, there is no user with the sessionEmail
        // Check if a user exists with the accountEmail
        const user = await prisma.user.findUnique({
            where: { email: req.user.accountEmail },
            include: { linkedAccounts: true },
        });
        if (user) {
            // User exists
            return user;
        } else {
            // User does not exist, we check if a linkedAccount with this email exists for github
            const linkedAccount = await prisma.linkedAccount.findFirst({
                where: {
                    accountEmail: req.user.accountEmail,
                    serviceName: 'github',
                },
            });
            if (linkedAccount) {
                // User exists but with different primary email
                const userId = linkedAccount.userId;
                const user = await prisma.user.findUnique({
                    where: { id: userId },
                    include: { linkedAccounts: true },
                });
                return user;
            }
        }
    }
    return null;
}

// Github auth routes
router.get('/github', async (req, res) => {
    const email = req.query.email;

    passport.session.email = email;
    passport.authenticate('github')(req, res);
});

router.get('/github/redirect',
    passport.authenticate('github', { failureRedirect: '/login' }),
    async (req, res) => {
        try {
            if (req.user === undefined) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            let user = await getUser(req);

            const userEmail = req.user.sessionEmail ?? req.user.accountEmail;

            const linkedAccountParams = {
                uuid: uuidv4(),
                serviceName: 'github',
                authToken: req.user.accessToken,
                username: req.user.username || 'Username not found',
                accountEmail: req.user.accountEmail,
            };

            const userParams = {
                email: userEmail,
                name: req.user.displayName || '',
                surname: '',
                uuid: uuidv4(),
                hashedPassword: req.user.accessToken,
            };

            if (!user) {
                // Create a new user
                userParams.authToken = uuidv4(); // Add authentication token
                user = await prisma.user.create({
                    data: {
                        ...userParams,
                        linkedAccounts: {
                            create: [linkedAccountParams],
                        },
                    },
                    include: { linkedAccounts: true },
                });
                linkedAccountParams.userId = user.id;

                await prisma.linkedAccount.update({
                    where: {
                        uuid: linkedAccountParams.uuid,
                    },
                    data: {
                        userId: user.id,
                    },
                });
            } else {
                // Check if the account is already linked
                const linkedAccount = user.linkedAccounts.find(
                    account => account.serviceName === 'github'
                );

                if (!linkedAccount) {
                    await prisma.linkedAccount.create({
                        data: {
                            ...linkedAccountParams,
                            userId: user.id, // Use the numeric ID from Prisma
                        },
                    });

                    // Refresh user data to include the new linked account
                    user = await prisma.user.findUnique({
                        where: { email: userParams.email },
                        include: { linkedAccounts: true },
                    });
                }
            }
            return res.redirect(`${process.env.FRONTEND_URL}/#/auth-callback?token=${user.authToken}`);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        }
    }
);

// DropBox auth routes
router.get('/dropbox', async (req, res) => {
    const email = req.query.email;

    passport.session.email = email;
    await passport.authenticate('dropbox-oauth2')(req, res);
});

router.get('/dropbox/callback',
    passport.authenticate('dropbox-oauth2', { failureRedirect: '/login' }),
    async (req, res) => {
        try {
            let user = await getUser(req);

            const userEmail = req.user.sessionEmail ?? req.user.accountEmail;

            const userParams = {
                email: userEmail,
                name: req.user.displayName || '',
                surname: '',
                uuid: uuidv4(),
                hashedPassword: req.user.accessToken,
            };

            const linkedAccountParams = {
                serviceName: 'dropbox',
                authToken: req.user.accessToken,
                username: req.user.displayName,
                uuid: uuidv4(),
                accountEmail: req.user.accountEmail,
            };

            if (!user) {
                // Create a new user
                userParams.authToken = uuidv4(); // Add authentication token
                user = await prisma.user.create({
                    data: {
                        ...userParams,
                        linkedAccounts: {
                            create: [linkedAccountParams],
                        },
                    },
                    include: { linkedAccounts: true },
                });
                linkedAccountParams.userId = user.id;

                await prisma.linkedAccount.update({
                    where: {
                        uuid: linkedAccountParams.uuid,
                    },
                    data: {
                        userId: user.id,
                    },
                });
            } else {
                // Check if the account is already linked
                const linkedAccount = user.linkedAccounts.find(
                    account => account.serviceName === 'dropbox'
                );

                if (!linkedAccount) {
                    await prisma.linkedAccount.create({
                        data: {
                            ...linkedAccountParams,
                            userId: user.id, // Use the numeric ID from Prisma
                        },
                    });

                    // Refresh user data to include the new linked account
                    user = await prisma.user.findUnique({
                        where: { email: userParams.email },
                        include: { linkedAccounts: true },
                    });
                }
            }

            return res.redirect(`${process.env.FRONTEND_URL}/#/auth-callback?token=${user.authToken}`);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        }
    }
);

// Spotify auth routes
router.get('/spotify', async (req, res) => {
    const email = req.query.email;

    passport.session.email = email;

    await passport.authenticate('spotify', {
        scope: ['user-read-private', 'user-read-email', 'playlist-modify-public', 'playlist-modify-private'],
        showDialog: true,
    })(req, res);
});

router.get('/spotify/callback',
    passport.authenticate('spotify', { failureRedirect: '/login' }),
    async (req, res) => {
        try {
            if (req.user === undefined) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            let user = await getUser(req);

            const userEmail = req.user.sessionEmail ?? req.user.accountEmail;

            const linkedAccountParams = {
                uuid: uuidv4(),
                serviceName: 'spotify',
                authToken: req.user.accessToken,
                username: req.user.username || 'Username not found',
                accountEmail: req.user.accountEmail,
            };

            const userParams = {
                email: userEmail,
                name: req.user.displayName || '',
                surname: '',
                uuid: uuidv4(),
                hashedPassword: req.user.accessToken,
            };

            if (!user) {
                // Create a new user
                userParams.authToken = uuidv4(); // Add authentication token
                user = await prisma.user.create({
                    data: {
                        ...userParams,
                        linkedAccounts: {
                            create: [linkedAccountParams],
                        },
                    },
                    include: { linkedAccounts: true },
                });
                linkedAccountParams.userId = user.id;

                await prisma.linkedAccount.update({
                    where: {
                        uuid: linkedAccountParams.uuid,
                    },
                    data: {
                        userId: user.id,
                    },
                });
            } else {
                // Check if the account is already linked
                const linkedAccount = user.linkedAccounts.find(
                    account => account.serviceName === 'spotify'
                );

                if (!linkedAccount) {
                    await prisma.linkedAccount.create({
                        data: {
                            ...linkedAccountParams,
                            userId: user.id, // Use the numeric ID from Prisma
                        },
                    });

                    // Refresh user data to include the new linked account
                    user = await prisma.user.findUnique({
                        where: { email: userParams.email },
                        include: { linkedAccounts: true },
                    });
                }
            }
            return res.redirect(`${process.env.FRONTEND_URL}/#/auth-callback?token=${user.authToken}`);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        }
    }
);

module.exports = router;

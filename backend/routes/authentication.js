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
    const headers = req.headers;

    if (!email) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Check if headers given are correct
    if (headers.authorization) {
        const user = await prisma.user.findUnique({
            where: { authToken: headers.authorization },
        });

        if (user === null) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
    } else {
        return res.status(401).json({ error: 'Unauthorized' });
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
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailData = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Reset password for Area Romain le malin',
            text: `Click on the link to reset your password: ${process.env.FRONTEND_URL}/reset-password/${user.uuid}`,
        };

        // Send email with reset password link
        transporter.sendMail(mailData, (err, info) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: err.message });
            }

        });
        return res.status(200).json({ message: 'Email sent' });
    });
});

// Method /GET because user will click on the link
router.get('/reset-password/:uuid', async (req, res) => {
    const { newPassword } = req.body;
    const uuid = req.params.uuid;

    if (!newPassword) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    prisma.user.findUnique({
        where: {
            uuid: uuid,
        },
    }).then((user) => {
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: err.message });
            }

            prisma.user.update({
                where: {
                    uuid: uuid,
                },
                data: {
                    hashedPassword,
                },
            }).then(() => {
                return res.status(20).json({ message: 'Password updated' });
            }).catch((error) => {
                console.error(error);
                return res.status(500).json({ error: error.message });
            });
        });
    });
});

// Google auth routes

router.get('/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        prompt: 'select_account',
    })
);

router.get('/google/redirect',
    passport.authenticate('google', { failureRedirect: '/login' }),
    async (req, res) => {
        try {
            const userParams = {
                email: req.user.emails[0].value,
                name: req.user.name.givenName,
                surname: req.user.name.familyName || '',
                uuid: uuidv4(),
                hashedPassword: req.user.id,
            };

            const linkedAccountParams = {
                uuid: uuidv4(),
                serviceName: 'google',
                authToken: req.user.id,
            };

            // Check if the user already exists
            let user = await prisma.user.findUnique({
                where: { email: userParams.email },
            });

            if (!user) {
                userParams.authToken = uuidv4();
                user = await prisma.user.create({ data: userParams });

                // Create a linked account for the new user
                linkedAccountParams.userId = user.id;
                await prisma.linkedAccount.create({ data: linkedAccountParams });

                return res.status(201).json(user);
            }

            // Check if the account is already linked
            const linkedAccount = await prisma.linkedAccount.findFirst({
                where: {
                    userId: user.id,
                    serviceName: 'google',
                },
            });

            if (!linkedAccount) {
                linkedAccountParams.userId = user.id;
                await prisma.linkedAccount.create({ data: linkedAccountParams });
            }

            // Return the existing user
            return res.status(200).json(user);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        }
    }
);

// Github auth routes

router.get('/github',
    passport.authenticate('github')
);

router.get('/github/redirect',
    passport.authenticate('github', { failureRedirect: '/login' }),
    async (req, res) => {
        try {
            const code = req.query.code;

            const clientId = req.user.id;
            console.log('Code:', code);
            console.log('Client ID:', clientId);
            const userParams = {
                email: req.user.emails[0].value,
                name: req.user.displayName || '',
                surname: '',
                uuid: uuidv4(),
                hashedPassword: req.user.accessToken,
            };

            const linkedAccountParams = {
                uuid: uuidv4(),
                serviceName: 'github',
                authToken: req.user.accessToken,
                username: req.user.username || 'Username not found',
            };

            // Check if the user already exists
            let user = await prisma.user.findUnique({
                where: { email: userParams.email },
            });

            if (!user) {
                // Create a new user
                userParams.authToken = uuidv4(); // Add authentication token
                user = await prisma.user.create({ data: userParams });

                // Create a linked account for the new user
                linkedAccountParams.userId = user.id;
                linkedAccountParams.username = req.user.username || 'Username not found';
                await prisma.linkedAccount.create({ data: linkedAccountParams });

                return res.status(201).json(user);
            }

            // Check if the account is already linked
            const linkedAccount = await prisma.linkedAccount.findFirst({
                where: {
                    userId: user.id,
                    serviceName: 'github',
                },
            });

            if (!linkedAccount) {
                linkedAccountParams.userId = user.id;
                const newLinkedAccount = await prisma.linkedAccount.create({ data: linkedAccountParams });
                if (!newLinkedAccount) {
                    return res.status(500).json({ error: 'Failed to create linked account' });
                }
            }

            try {
                const tokenResponse = await axios.post(
                    'https://github.com/login/oauth/access_token',
                    {
                        client_id: process.env.GITHUB_CLIENT_ID,
                        client_secret: process.env.GITHUB_CLIENT_SECRET,
                        code,
                        redirect_uri: `http://localhost:8080/auth/github/redirect`,
                        state: uuidv4(),
                    },
                    {
                        headers: {
                            Accept: 'application/json',
                        },
                    }
                );

                console.log(tokenResponse.data);

                const { access_token } = tokenResponse.data;

                if (!access_token) {
                    return res.status(400).send("Failed to get access token");
                }
            } catch (error) {
                console.log(error);
                return res.status(500).send("Failed to exchange code for access token");
            }


            if (linkedAccount) {
                await prisma.linkedAccount.update({
                    where: {
                        id: linkedAccount.id,
                    },
                    data: {
                        authToken: authTokenResponse.data.access_token,
                    },
                });
            } else {
                return res.status(404).json({ error: 'Linked account not found' });
            }

            // Redirect to www.google.com
            return res.redirect(process.env.FRONTEND_URL);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        }
    }
);

module.exports = router;

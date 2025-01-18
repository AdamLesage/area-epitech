/*
** EPITECH PROJECT, 2024
** area-epitech
** File description:
** authentication
*/

const express = require('express');
const router = express.Router();
const passport = require('passport');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');
const axios = require('axios');
const { google } = require('googleapis');
const { initializeGmailClient } = require('../utils/initGmailClient');
// Intern auth routes

// Global variable for reset email code
let resetPasswordCodeAccordingToEmail = {};

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
    const { password, email } = req.body;

    if (!password || !email) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const areaServiceParams = {
        uuid: uuidv4(),
        serviceName: 'area',
        authToken: uuidv4(),
        username: '',
        accountEmail: email || '',
    };

    const timerServiceParams = {
        uuid: uuidv4(),
        serviceName: 'timer',
        authToken: uuidv4(),
        username: '',
        accountEmail: email || '',
    };

    const userParams = {
        email: email,
        name: '',
        surname: '',
        uuid: uuidv4(),
        hashedPassword: hashedPassword,
        profilePictureUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQazX23mmRHm5lgOZFbIud3sAtL42CI-ykqw&s',
    };

    // Check if a user with this email already exists
    let user = await prisma.user.findUnique({
        where: { email: email },
        include: { linkedAccounts: true },
    });

    if (user) {
        return res.status(409).json({ error: 'User already exists' });
    }

    try {
        userParams.authToken = uuidv4(); // Add authentication token
        user = await prisma.user.create({
            data: {
                ...userParams,
                linkedAccounts: {
                    create: [areaServiceParams, timerServiceParams],
                },
            },
            include: { linkedAccounts: true },
        });

        areaServiceParams.userId = user.id;
        await prisma.linkedAccount.update({
            where: {
                uuid: areaServiceParams.uuid,
            },
            data: {
                userId: user.id,
            },
        });

        timerServiceParams.userId = user.id;
        await prisma.linkedAccount.update({
            where: {
                uuid: timerServiceParams.uuid,
            },
            data: {
                userId: user.id,
            },
        });

        return res.status(201).json({ message: 'User registered', authToken: user.authToken });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
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

    try {
        // Check if the user exists
        const user = await prisma.user.findUnique({
            where: { email: email },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Generate a random verification code
        const code = Math.floor(100000 + Math.random() * 900000);

        // Configure Nodemailer
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        // Create the email data
        const mailData = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset',
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
                    <div style="padding: 20px; border: 1px solid #ddd; border-radius: 10px; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #007bff;">Réinitialisation de votre mot de passe</h2>
                        <p>Bonjour,</p>
                        <p>Nous avons reçu une demande de réinitialisation de votre mot de passe. Veuillez utiliser le code de
                        vérification ci-dessous :</p>
                        <div style="text-align: center; font-size: 24px; font-weight: bold; color: #007bff; margin: 20px 0;">
                        ${code}
                        </div>
                        <p>Si vous n'avez pas fait cette demande, vous pouvez ignorer cet e-mail.</p>
                        <p style="color: #666; font-size: 12px;">Merci,</p>
                        <p style="color: #666; font-size: 12px;">L'équipe de support Area Romain le malin</p>
                    </div>
                </div>
            `
        };

        // Send the email
        const info = await transporter.sendMail(mailData);

        // Store the verification code for this email
        resetPasswordCodeAccordingToEmail[email] = code;

        return res.status(200).json({ message: `Email sent to ${email}`, info });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
});

router.post('/reset-password-confirm', async (req, res) => {
    const { email, code } = req.body;

    if (!email || !code) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    if (resetPasswordCodeAccordingToEmail[email] === parseInt(code, 10)) {
        // Redirect to the reset password page
        return res.status(200).json({ message: 'Code is correct', redirectUrl: `/change-password?code=${code}&email=${email}` });
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
        return res.status(200).json({ message: 'Password updated', redirectUrl: '/login' });
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

/**
 * Handles the user authentication in the Database.
 * 
 * @param {string} username - The username of the user.
 * @param {string} accountEmail - The email associated with the account.
 * @param {string} userEmail - The email of the user.
 * @param {string} displayName - The display name of the user.
 * @param {string} surname - The surname of the user.
 * @param {string} authToken - The authentication token.
 * @param {string} serviceName - The name of the service.
 * @param {object} user - The user object.
 * @returns {string} - The authentication token of the user.
 */
async function auth(username, accountEmail, userEmail, displayName, surname, authToken, serviceName, user) {
    const linkedAccountParams = {
        uuid: uuidv4(),
        serviceName: serviceName,
        authToken: authToken,
        username: username || '',
        accountEmail: accountEmail,
    };

    const areaServiceParams = {
        uuid: uuidv4(),
        serviceName: 'area',
        authToken: uuidv4(),
        username: username || '',
        accountEmail: accountEmail || '',
    };

    const timerServiceParams = {
        uuid: uuidv4(),
        serviceName: 'timer',
        authToken: uuidv4(),
        username: username || '',
        accountEmail: accountEmail || '',
    };

    const userParams = {
        email: userEmail,
        name: displayName || '',
        surname: surname || '',
        uuid: uuidv4(),
        hashedPassword: authToken,
        profilePictureUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQazX23mmRHm5lgOZFbIud3sAtL42CI-ykqw&s'
    };

    if (!user) {
        // Create the new user
        userParams.authToken = uuidv4(); // Add authentication token
        user = await prisma.user.create({
            data: {
                ...userParams,
                linkedAccounts: {
                    create: [linkedAccountParams, areaServiceParams, timerServiceParams],
                },
            },
            include: { linkedAccounts: true },
        });

        // Create the linkedAccount
        linkedAccountParams.userId = user.id;
        await prisma.linkedAccount.update({
            where: {
                uuid: linkedAccountParams.uuid,
            },
            data: {
                userId: user.id,
            },
        });

        // Create the area service linked account
        areaServiceParams.userId = user.id;
        await prisma.linkedAccount.update({
            where: {
                uuid: areaServiceParams.uuid,
            },
            data: {
                userId: user.id,
            },
        });

        // Create the timer service linked account
        timerServiceParams.userId = user.id;
        await prisma.linkedAccount.update({
            where: {
                uuid: timerServiceParams.uuid,
            },
            data: {
                userId: user.id,
            },
        });
    } else {
        // Check if the account is already linked
        const linkedAccount = await user.linkedAccounts.find(
            account => account.serviceName === serviceName
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
                where: { email: userParams.email }
            });
        }
    }

    return user.authToken;
}

router.get('/cancel', (req, res) => {
    return res.redirect(`${process.env.FRONTEND_URL}/`);
});

// Github auth routes
router.get('/github', async (req, res) => {
    const email = req.query.email;

    passport.session.email = email;
    passport.authenticate('github')(req, res);
});

router.get('/github/redirect',
    passport.authenticate('github', { failureRedirect: '/auth/cancel' }),
    async (req, res) => {
        try {
            if (req.user === undefined) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            let user = await getUser(req);

            const userEmail = req.user.sessionEmail ?? req.user.accountEmail;

            const authToken = await auth(
                req.user.username,
                req.user.accountEmail,
                userEmail,
                req.user.displayName,
                req.user.surname,
                req.user.accessToken,
                'github',
                user);

            return res.redirect(`${process.env.FRONTEND_URL}/auth-callback?token=${authToken}`);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        }
    }
);

// Discord auth routes
router.get('/discord', async (req, res) => {
    const email = req.query.email;

    passport.session.email = email;
    passport.authenticate('discord')(req, res);
});

router.get('/discord/callback',
    passport.authenticate('discord', { failureRedirect: '/auth/cancel' }),
    async (req, res) => {
        try {
            if (req.user === undefined) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            let user = await getUser(req);

            const userEmail = req.user.sessionEmail ?? req.user.accountEmail;

            const authToken = await auth(
                req.user.username,
                req.user.accountEmail,
                userEmail,
                req.user.displayName,
                req.user.surname,
                req.user.accessToken,
                'discord',
                user);

            return res.redirect(`${process.env.FRONTEND_URL}/auth-callback?token=${authToken}`);
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
    passport.authenticate('dropbox-oauth2', { failureRedirect: '/auth/cancel' }),
    async (req, res) => {
        try {
            let user = await getUser(req);

            const userEmail = req.user.sessionEmail ?? req.user.accountEmail;

            const authToken = await auth(
                req.user.username,
                req.user.accountEmail,
                userEmail,
                req.user.displayName,
                req.user.surname,
                req.user.accessToken,
                'dropbox',
                user);

            return res.redirect(`${process.env.FRONTEND_URL}/auth-callback?token=${authToken}`);
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
        scope: ['user-modify-playback-state', 'user-library-modify', 'user-read-private', 'user-read-email', 'playlist-modify-public', 'playlist-modify-private'],
        showDialog: true,
    })(req, res);
});

router.get('/spotify/callback',
    passport.authenticate('spotify', { failureRedirect: '/auth/cancel' }),
    async (req, res) => {
        try {
            if (req.user === undefined) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            let user = await getUser(req);

            const userEmail = req.user.sessionEmail ?? req.user.accountEmail;

            const authToken = await auth(
                req.user.username,
                req.user.accountEmail,
                userEmail,
                req.user.displayName,
                req.user.surname,
                req.user.accessToken,
                'spotify',
                user);

            return res.redirect(`${process.env.FRONTEND_URL}/auth-callback?token=${authToken}`);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        }
    }
);

// Google auth routes
router.get('/google', async (req, res) => {
    const email = req.query.email;

    passport.session.email = email;

    await passport.authenticate('google', {
        scope: ['profile', 'email',
            'https://mail.google.com/',
            'https://www.googleapis.com/auth/gmail.readonly',
            'https://www.googleapis.com/auth/gmail.compose',
            'https://www.googleapis.com/auth/gmail.modify',
            'https://www.googleapis.com/auth/gmail.insert',
            'https://www.googleapis.com/auth/gmail.settings.basic'],
        accessType: 'offline',
        approvalPrompt: 'force'
    })(req, res);
});

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/auth/cancel', }),
    async (req, res) => {
        try {
            if (req.user === undefined) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            let user = await getUser(req);

            const userEmail = req.user.sessionEmail ?? req.user.accountEmail;

            const authToken = await auth(
                req.user.username,
                req.user.accountEmail,
                userEmail,
                req.user.displayName,
                req.user.surname,
                req.user.refreshToken,
                'gmail',
                user);

            await watchGmail(req.user.refreshToken);
            return res.redirect(`${process.env.FRONTEND_URL}/auth-callback?token=${authToken}`);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        }
    }
);

async function watchGmail(refreshToken) {
    try {
        const gmail = await initializeGmailClient(refreshToken)

        const response = await gmail.users.watch({
            userId: 'me',  // 'me' corresponds to the authenticated user
            requestBody: {
                labelIds: ['INBOX'],  // Notifications only for the inbox
                topicName: 'projects/area-romain-le-malin/topics/gmail-notification',  // Your Pub/Sub topic
            },
        });

        console.log('Watch response:', response.data);
    } catch (error) {
        console.error('Error setting up Gmail watch:', error);
    }
}

const { Client, Token } = require('strava-oauth2');

// Configuration minimale pour le client Strava
let config = {
    client_id: process.env.STRAVA_CLIENT_ID,
    client_secret: process.env.STRAVA_CLIENT_SECRET,
    redirect_uri: `${process.env.BACKEND_URL}/auth/strava/callback`,
};

const client = new Client(config);

// Strava auth routes
router.get('/strava', (req, res) => {
    const email = req.query.email;
    req.session.email = email;

    config.redirect_uri = `${process.env.BACKEND_URL}/auth/strava/callback` + `?email=${email}`;
    const authorizationUri = `https://www.strava.com/oauth/authorize?client_id=${config.client_id}&response_type=code&redirect_uri=${config.redirect_uri}&approval_prompt=auto&scope=read,activity:read_all,activity:write,profile:read_all,profile:write`;
    res.redirect(authorizationUri);
});

router.get('/strava/callback', async (req, res) => {
    try {
        const email = req.query.email;
        const code = req.query.code;
        if (!email) {
            return res.status(400).json({ error: 'Missing email parameter' });
        }

        // Find user from email
        const user = await prisma.user.findUnique({
            where: { email },
            include: { linkedAccounts: true },
        });

        // Request to get the token
        const token = await axios.post('https://www.strava.com/api/v3/oauth/token', {
            client_id: process.env.STRAVA_CLIENT_ID,
            client_secret: process.env.STRAVA_CLIENT_SECRET,
            code: code,
            grant_type: 'authorization_code',
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const linkedAccount = user.linkedAccounts.find(
            account => account.serviceName === 'strava'
        );

        // Send request to get a subscription with secured URL
        try {
            const response = await axios.post('https://www.strava.com/api/v3/push_subscriptions', null, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                params: {
                    client_id: process.env.STRAVA_CLIENT_ID,
                    client_secret: process.env.STRAVA_CLIENT_SECRET,
                    callback_url: `${process.env.DEPLOYED_BACKEND_URL}/strava/webhook`,
                    verify_token: 'STRAVA',
                },
            });
        } catch (error) {
            console.error('Subscription already exists');
        }

        // If it doesnt exist, create a linked account
        if (!linkedAccount) {
            let linkedAccountParams = {
                serviceName: 'strava',
                authToken: token.data.access_token,
                accountEmail: "NoAccountEmailForStrava",
                username: user.name + user.surname,
                uuid: uuidv4(),
            };

            await prisma.linkedAccount.create({
                data: {
                    ...linkedAccountParams,
                    userId: user.id,
                },
            });
        }

        // Create a linked account with strava
        return res.redirect(`${process.env.FRONTEND_URL}/auth-callback?token=${user.authToken}`);
    } catch (error) {
        console.error(`Error during token retrieval: ${error.message}`);
        return res.status(500).json({ error: 'Failed to retrieve token' });
    }
});

module.exports = router;

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

// Intern auth routes

router.get('/login', (req, res) => {
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

        bcrypt.compare(password, user.password, (err, result) => {
            if (result) {
                return res.status(200).json({ message: 'User logged in' });
            }
            return res.status(401).json({ error: 'Invalid password' });
        });
    });
});

router.post('/register', async (req, res) => {
    const { password, email, name, surname, bio, birthDate, phoneNumber, profilePicture } = req.body;

    if (!password || !email || !name || !surname) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const uuid = uuidv4();

    prisma.user.create({
        data: {
            email,
            hashedPassword,
            name,
            surname,
            bio,
            uuid: uuid,
            birthDate: birthDate ? new Date(birthDate) : null,
            phoneNumber,
            profilePicture: profilePicture ? { create: profilePicture } : undefined,
        },
    }).then((user) => {
        return res.status(201).json(user);
    }).catch((error) => {
        console.error(error);
        return res.status(500).json({ error: error.message });
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
    passport.authenticate('google', {
        failureRedirect: '/login'
    }),
    (req, res) => {
        console.log('User:', req.user);
        const userParams = {
            email: req.user.emails[0].value,
            name: req.user.name.givenName,
            surname: req.user.name.familyName || '',
            // profilePicture: {
            //     create: {
            //         url: req.user.photos[0].value,
            //     },
            // },
            uuid: uuidv4(),
            googleAccessToken: req.user.accessToken,
            hashedPassword: '',
        };

        prisma.user.findUnique({
            where: {
                email: userParams.email,
            },
        }).then((user) => {
            if (!user) {
                prisma.user.create({
                    data: userParams,
                }).then((newUser) => {
                    return res.status(201).json(newUser);
                }).catch((error) => {
                    console.error(error);
                    return res.status(500).json({ error: error.message });
                });
            } else {
                return res.status(200).json(user);
            }
        }).catch((error) => {
            console.error(error);
            return res.status(500).json({ error: error.message });
        });
    }
);

// Github auth routes

router.get('/github',
    passport.authenticate('github')
);

router.get('/github/redirect',
    passport.authenticate('github', {
        failureRedirect: '/login'
    }),
    (req, res) => {
        console.log('User:', req.user);
        const userParams = {
            email: req.user.emails[0].value,
            name: req.user.displayName,
            surname: '',
            // profilePicture: {
            //     create: {
            //         url: req.user.photos[0].value,
            //     },
            // },
            uuid: uuidv4(),
            githubAccessToken: req.user.accessToken,
            hashedPassword: '',
        };

        prisma.user.findUnique({
            where: {
                email: userParams.email,
            },
        }).then((user) => {
            if (!user) {
                prisma.user.create({
                    data: userParams,
                }).then((newUser) => {
                    return res.status(201).json(newUser);
                }).catch((error) => {
                    console.error(error);
                    return res.status(500).json({ error: error.message });
                });
            } else {
                return res.status(200).json(user);
            }
        }).catch((error) => {
            console.error(error);
            return res.status(500).json({ error: error.message });
        });
    }
);

module.exports = router;
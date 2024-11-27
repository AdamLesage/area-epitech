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
        res.redirect('/');
    }
);

router.get('/login', (req, res) => {
    res.send('Login page');
});

module.exports = router;
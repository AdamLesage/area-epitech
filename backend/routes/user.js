/*
** EPITECH PROJECT, 2024
** area-epitech
** File description:
** User
*/

const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

/**
 * @brief return a list of all actions of the user
 *
 * @param [string] uuids
 * @param [string] emails
 * @return {object} users
 *
 * @example GET /users?uuids=1,2,3&emails=adam@area.fr,romain@area.fr
 * @autor Adam Lesage
 */
router.get('/users', async (req, res) => {
    const { uuids, emails } = req.query;
    const headers = req.headers;
    const query = {};

    if (uuids) {
        query.uuid = { in: uuids.split(',') };
    }

    if (emails) {
        query.email = { in: emails.split(',') };
    }

    // Check if headers given are correct
    if (headers.authorization) {
        const user = await prisma.user.findUnique({
            where: {
                authToken: headers.authorization,
            },
        });

        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
    } else {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const users = await prisma.user.findMany({
            where: query,
        });
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * @brief get a user by uuid
 *
 * @param {string} uuid
 * @return {object} user
 * @example GET /user/uuid
 * @autor Adam Lesage
 */
router.get('/user/:uuid', async (req, res) => {
    const uuid = req.params.uuid;
    const headers = req.headers;

    // Check if headers given are correct
    if (headers.authorization) {
        const user = await prisma.user.findUnique({
            where: {
                authToken: headers.authorization,
            },
        });

        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
    } else {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const user = await prisma.user.findUnique({ where: { uuid } });
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * @brief create a new user and return the user, password will be hashed
 *
 * @param {string} email
 * @param {string} password
 * @param {string} username
 * @return {object} user
 * @exemple POST /user { email: "adam@area.fr", hashed_password: "password", username: "adam" }
 * @autor Adam Lesage
 */
router.post('/user', async (req, res) => {
    const { name, surname, bio, birthDate, email, phoneNumber, password } = req.body;

    if (!name || !surname || !bio || !birthDate || !email || !phoneNumber || !password) {
        return res.status(400).json({ error: 'Missing parameters' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const uuid = uuidv4();
    try {
        const user = await prisma.user.create({
            data: {
                uuid: uuid,
                name: name,
                surname: surname,
                bio: bio,
                birthDate: birthDate,
                email: email,
                phoneNumber: phoneNumber,
                hashedPassword: hashedPassword,
                authToken: `Bearer ${uuidv4()}`,
            },
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * @brief delete the user
 *
 * @param {string} uuid
 * @return {object} message
 * @exemple DELETE /user/uuid
 * @autor Adam Lesage
 */
router.delete('/user/:uuid', async (req, res) => {
    const uuid = req.params.uuid;
    const headers = req.headers;

    // Check if headers given are correct
    if (headers.authorization) {
        const user = await prisma.user.findUnique({
            where: {
                authToken: headers.authorization,
            },
        });

        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
    } else {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        await prisma.user.delete({ where: { uuid } });
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * @brief update the user
 * 
 * @param {string} uuid
 * @return {object} user
 * @exemple PUT /user/uuid { email: "adam@area.com", username: "adam" }
 * @autor Adam Lesage
 */
router.put('/user/:uuid', async (req, res) => {
    const uuid = req.params.uuid;
    const headers = req.headers;

    // Check if headers given are correct
    if (headers.authorization) {
        const user = await prisma.user.findUnique({
            where: {
                authToken: headers.authorization,
            },
        });

        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
    } else {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const data = {};
    if (req.body.email) data.email = req.body.email;
    if (req.body.password) data.hashedPassword = bcrypt.hashSync(req.body.password, 10);
    if (req.body.name) data.name = req.body.name;
    if (req.body.surname) data.surname = req.body.surname;
    if (req.body.bio) data.bio = req.body.bio;
    if (req.body.birthDate) data.birthDate = req.body.birthDate;
    if (req.body.phoneNumber) data.phoneNumber = req.body.phoneNumber;

    try {
        const user = await prisma.user.update({
            where: { uuid },
            data: data,
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
/*
** EPITECH PROJECT, 2024
** area-epitech
** File description:
** User
*/

const Prisma = require('@prisma/client');
const prisma = new Prisma.PrismaClient;
/**
 * setup the action route
 */
module.exports.setup = (app) => {
    /**
     * @brief return a list of all actions of the user
     * 
     * @param [string] uuids
     * @param [string] emails
     * @return {object} users
     * 
     * @example GET /users?uuids=1,2,3&emails=adam@area.fr,romain@area.fr
     * @author Adam Lesage
     */
    app.get('/users', async (req, res) => {
        const { uuids, emails } = req.query;
        const query = {};

        if (uuids) {
            query.id = { in: uuids.split(',') };
        }

        if (emails) {
            query.email = { in: emails.split(',') };
        }

        try {
            const users = await prisma.user.findMany({ where: Object.keys(query).length ? query : undefined });
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    /**
     * @brief get a user by id
     * 
     * @param {string} id
     * @return {object} user
     * @exemple GET /user/1
     * @author Adam Lesage
     */
    app.get('/user/:id', async (req, res) => {
        const id = parseInt(req.params.id);

        try {
            const user = await prisma.user.findUnique({ where: { id } });
            res.json(user);
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
     * @author Adam Lesage
     */
    app.post('/user', async (req, res) => {
        const { email, password, username } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);
        try {
            const user = await prisma.user.create({
                data: {
                    email: email,
                    hashed_password: hashedPassword,
                    username: username,
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
     * @param {string} id
     * @return {object} message
     * @exemple DELETE /user/1
     * @autor Adam Lesage
     */
    app.delete('/user/:id', async (req, res) => {
        const id = parseInt(req.params.id);

        try {
            await prisma.user.delete({ where: { id } });
            res.json({ message: 'User deleted' });
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });
    /**
     * @brief update the user
     * 
     * @param {string} id
     * @param {string} email
     * @param {string} password
     * @param {string} username
     * @return {object} user
     * @exemple PUT /user/1 { email: "adam@area.com", username: "adam" }
     * @autor Adam Lesage
     */
    app.put('/user/:id', async (req, res) => {
        const id = parseInt(req.params.id);
        const { email, username } = req.body;

        const data = {};
        if (email) data.email = email;
        if (username) data.username = username;

        try {
            const user = await prisma.user.update({
                where: { id },
                data: data,
            });
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });
};
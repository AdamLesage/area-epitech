/*
** EPITECH PROJECT, 2024
** area-epitech
** File description:
** Action
*/

const Prisma = require('@prisma/client');
const prisma = new Prisma.PrismaClient;
/**
 * setup the action route
 */
module.exports.setup = (app) => {
    /**
     * @brief return a list of all actions of the user
     */
    app.get('/action', async (req, res) => {
        const posts = await prisma.action.findMany({
            where: { isActive: true },
        })
        res.json(posts)
    });

    /**
     * @brief create a new action and return the action
     */
    app.post('/action', async (req, res) => {
        const { title, typeAction, typeReaction, userId, reactionData, actionData } = req.body;
        try {
            const post = await prisma.action.create({
                data: {
                    title: title,
                    typeAction: typeAction,
                    typeReaction: typeReaction,
                    actionData: actionData,
                    reactionData: reactionData,
                    // user: {
                    //     connect: { id: userId },
                    // },
                },
            })
            res.json(post)
        } catch (e) {
            console.error(e);
            res.status(500).send("error on create action");
        }
    });

    /**
     * @brief delete the action
     */
    app.delete('/action/:id', async (req, res) => {
        const id = parseInt(req.params.id);
        try {
            await prisma.action.delete({
                where: { id: id },
                })
                res.json({ message: "action deleted" })
        } catch (e) {
            console.error(e);
            res.status(500).send("error on delete action");
        }
    })
};

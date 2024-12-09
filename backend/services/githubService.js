const express = require('express');
const router = express.Router();

router.post('/webhook', (req, res) => {
    console.log('Requête reçue :');
    const event = req.headers['x-github-event'];
    const action = req.body['action'];
    const eventSender = req.body.sender['login'];

    console.log(`New event: ${event} ${action} receive from ${eventSender}`)

    // Réponse pour confirmer que la requête est reçue
    res.status(200).send('Webhook reçu avec succès');
});

module.exports = router;

const express = require('express');
const router = express.Router();
const service = require('../services/services.json');

/**
 * @brief return a list of all actions and reaction of the server
 *
 * @return {json} services
 *
 * @autor Romain chevallier
 */
router.get('/about.json', async (req, res) => {
    const ip = req.ip.startsWith('::ffff:') ? req.ip.split(':').pop() : req.ip;
    res.json({client: {host: ip}, server: {current_time: Math.floor(Date.now() / 1000), service: service}})
});

module.exports = router;
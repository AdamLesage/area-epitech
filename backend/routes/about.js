const express = require('express');
const router = express.Router();
const service = require('../services/services.json');
const servicesInfo = require('../services/services-info.json');

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

router.get('/services-info.json', async (_, res) => {
    res.status(200).json({services: servicesInfo});
});

router.get('/services-areas.json', async (_, res) => {
    res.status(200).json({services: service});
});

module.exports = router;

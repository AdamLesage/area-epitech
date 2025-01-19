const express = require('express');
const router = express.Router();
const service = require('../services/about.json');
const servicesInfo = require('../services/services-info.json');

/**
 * @return {json} services + server info
 *
 * @autor Romain Chevallier
 */
router.get('/about.json', async (req, res) => {
    const ip = req.ip.startsWith('::ffff:') ? req.ip.split(':').pop() : req.ip;
    res.status(200).json({client: {host: ip}, server: {current_time: Math.floor(Date.now() / 1000), service: service}});
});

/**
 * @return {json} services info
 * 
 * @autor Tugdual de Reviers
 */
router.get('/services-info.json', async (_, res) => {
    res.status(200).json({services: servicesInfo});
});

/**
 * @return {json} services
 * 
 * @autor Tugdual de Reviers
 */
router.get('/services-areas.json', async (_, res) => {
    res.status(200).json({services: service});
});

module.exports = router;

const express = require('express');
const { Op } = require('sequelize');
// const bcrypt = require('bcryptjs');
// const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { Venue } = require('../../db/models');
// const { check } = require('express-validator');
// const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

const { requireAuth } = require('../../utils/auth.js');

router.put('/:venueId', requireAuth, async (req, res) => {

    const venue = await Venue.findByPk(req.params.venueId)

    if (!venue) {
        res.status(404);
        res.json({
            "message": "Venue couldn't be found"
          })
    }
    
    const { address, city, state, lat, lng } = req.body

    if (address !== undefined) venue.address = address
    if (city !== undefined) venue.city = city
    if (state !== undefined) venue.state = state
    if (lat !== undefined) venue.lat = lat
    if (lng !== undefined) venue.lng = lng

    await venue.save()

    res.json(venue)

})


module.exports = router;
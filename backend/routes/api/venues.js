const express = require('express');
const { Op } = require('sequelize');
// const bcrypt = require('bcryptjs');
// const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { Venue } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

const { requireAuth } = require('../../utils/auth.js');
const validateVenues = [
    check('address')
        .exists()
        .withMessage("Street address is required"),
    check('city')
        .exists()
        .withMessage("City is required"),
    check('state')
        .exists()
        .withMessage("State is required"),
        handleValidationErrors
  ]
router.put('/:venueId', requireAuth, validateVenues, async (req, res) => {

    const venue = await Venue.findByPk(req.params.venueId)

    if (!venue) {
        res.status(404);
        res.json({
            "message": "Venue couldn't be found"
          })
    }
    
    const { address, city, state, lat, lng } = req.body

    if(lat < -90 || lat > 90) {
        res.status(400);
        return res.json({
            message: "Bad Request",
            errors: {"lat": "Latitude must be within -90 and 90"}
        })
    }

    if(lng < -180 || lng > 180) {
        res.status(400);
        return res.json({
            message: "Bad Request",
            errors: {"lng": "Longitude must be within -180 and 180"}
    })
    }
    if (address !== undefined) venue.address = address
    if (city !== undefined) venue.city = city
    if (state !== undefined) venue.state = state
    if (lat !== undefined) venue.lat = lat
    if (lng !== undefined) venue.lng = lng

    await venue.save()

    const newVenue = {
        id: venue.id,
        groupId: venue.groupId,
        address: venue.address,   
        city: venue.city,
        state: venue.state,  
        lat: venue.lat,   
        lng: venue.lng
    }
    res.json(newVenue)

})


module.exports = router;
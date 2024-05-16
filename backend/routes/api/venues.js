const express = require('express');
const { Op } = require('sequelize');
// const bcrypt = require('bcryptjs');
// const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { Venue, Group, User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

const { requireAuth } = require('../../utils/auth.js');
const validateVenues = [
    check('address')
        .isLength({min: 1})
        .withMessage("Street address is required"),
    check('city')
        .isLength({min: 1})
        .withMessage("City is required"),
    check('state')
        .isLength({min: 1})
        .withMessage("State is required"),
    check('lat')
        .isFloat({
            min: -90,
            max: 90
        })
        .withMessage("Latitude must be within -90 and 90"),
    check('lng')
        .isFloat({
            min: -180,
            max: 180
        })
        .withMessage("Longitude must be within -180 and 180"),
        handleValidationErrors
  ]
router.put('/:venueId', requireAuth, validateVenues, async (req, res) => {

    const { user } = req;
    let safeUser;
    if (user) {
        safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
      }
    }

    const venue = await Venue.findByPk(req.params.venueId, {
        include: Group
    })

    if (!venue) {
        res.status(404);
        return res.json({
            "message": "Venue couldn't be found"
          })
    }
    
    const group = await Group.findByPk(venue.Group.id, {
        include: User
    })

    const isCoHost = group.Users.find((coHost) => safeUser.id === coHost.id && coHost.Membership.status === 'co-host')
    

    
    const { address, city, state, lat, lng } = req.body


    if (isCoHost || safeUser.id === group.organizerId) {

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
        return res.json(newVenue)

    } else {

        res.status(403);
        return res.json({
            message: 'Require Authentication: Current User must be the organizer of the group or a member of the group with a status of "co-host"'
        })
    }
 

})


module.exports = router;
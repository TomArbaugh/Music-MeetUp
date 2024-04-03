const express = require('express');
const { Op } = require('sequelize');
// const bcrypt = require('bcryptjs');
// const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { Event, Group, Venue, Attendance, EventImage } = require('../../db/models');
// const { check } = require('express-validator');
// const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

const { requireAuth } = require('../../utils/auth.js');


router.get('/:eventId', async (req, res) => {

    const event = await Event.findByPk(req.params.eventId, {
        include: [Attendance, Group, Venue, EventImage]
    })
    res.json(event)
});


router.get('/', async (req, res) => {
    const events = await Event.findAll({
        include: [Group, Venue, Attendance]
    })
    res.json({events})
});


router.post('/:eventId/images', requireAuth, async (req, res) => {
    const {url, preview} = req.body
    const newImage = await EventImage.create({
        eventId: req.params.eventId,
        url,
        preview
    });

    res.json(newImage)
});

router.put('/:eventId', requireAuth, async (req, res) => {
    const {venueId, name, type, capacity, price, description, startDate, endDate} = req.body
    
    const event = await Event.findByPk(req.params.eventId)

    if (venueId !== undefined) event.venueId = venueId;
    if (name !== undefined) event.name = name;
    if (type !== undefined) event.type = type;
    if (capacity !== undefined) event.capacity = capacity;
    if (price !== undefined) event.price = price;
    if (description !== undefined) event.description = description;
    if (startDate !== undefined) event.startDate = startDate;
    if (endDate !== undefined) event.endDate = endDate;

    await event.save()

    res.json(event)
});


router.delete('/:eventId', requireAuth, async (req, res) => {

    const toDelete = await Event.findByPk(req.params.eventId)
    await toDelete.destroy()
    res.json({
        "message": "Successfully deleted"
      })
});


module.exports = router;
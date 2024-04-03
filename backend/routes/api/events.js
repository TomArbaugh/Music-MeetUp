const express = require('express');
const { Op } = require('sequelize');
// const bcrypt = require('bcryptjs');
// const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { Event, Group, Venue, Attendance, EventImage, User } = require('../../db/models');
// const { check } = require('express-validator');
// const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

const { requireAuth } = require('../../utils/auth.js');

router.get('/:eventId/attendees', async (req, res) => {

    const attendees = await Event.findByPk(req.params.eventId, {
        include: [Attendance, User]
    });
    let Attendees = []
    attendees.Attendances.forEach((attendee) => {
       const user = attendees.Users.find((user) => user.id === attendee.userId);

      let newAttendee = {}
        if (attendee.id !== undefined) attendee.id = id
        newAttendee.firstName = user.firstName
        newAttendee.lastName = user.lastName
        newAttendee.Attendance = {status: attendee.status}

        Attendees.push(newAttendee)
    })
    res.json({Attendees})
});


router.get('/:eventId', async (req, res) => {

    const event = await Event.findByPk(req.params.eventId, {
        include: [Attendance, Group, Venue, EventImage]
    })
    res.json(event)
});


router.get('/', async (req, res) => {

    let { page, size, name, type, startDate } = req.query

    page = parseInt(page);
    size = parseInt(size);

    if (isNaN(page)) page = 1
    if (page > 10) throw new Error()
    if (isNaN(size)) size = 20
    if (size > 20) throw new Error()

    const pagination = {}
    pagination.limit = size
    pagination.offset = size * (page -1)

    const where = {}
    if (name) where.name = name
    if (type) where.type = type
    if (startDate) where.startDate = startDate
    if(name === undefined && type === undefined && startDate === undefined) delete where

    const events = await Event.findAll({
        where,
        include: [Group, Venue, Attendance],
        ...pagination
    })
    res.json({
        events
    })
});

router.post('/:eventId/attendance', requireAuth, async (req, res) => {

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
    const event = await Event.findByPk(req.params.eventId, {
        include: Attendance
    });

    const newAttendance = await Attendance.create({
        eventId: req.params.eventId,
        userId: safeUser.id,
        status: 'Attending'
    })

    res.json({
        "userId": safeUser.id,
        "status": "Attending"
      })
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


router.put('/:eventId/attendance', requireAuth, async (req, res) => {
    const {userId, status} = req.body
    const event = await Event.findByPk(req.params.eventId, {
        include: Attendance
    })
    const statusChange = event.Attendances.find((attend) => parseInt(userId) === attend.userId)

    statusChange.status = status
    res.json(statusChange)
})

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

router.delete('/:eventId/attendance/:userId', requireAuth, async (req, res) => {
    const userAttending = await Event.findByPk(req.params.eventId, {
        include: Attendance
    });
    const attendanceToDelete = userAttending.Attendances.find((attendee) => parseInt(req.params.userId) === attendee.userId)

    await attendanceToDelete.destroy()
    res.json({
        "message": "Successfully deleted attendance from event"
      })
})

router.delete('/:eventId', requireAuth, async (req, res) => {

    const toDelete = await Event.findByPk(req.params.eventId)
    await toDelete.destroy()
    res.json({
        "message": "Successfully deleted"
      })
});


module.exports = router;
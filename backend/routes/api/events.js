const express = require('express');
const { Op } = require('sequelize');
// const bcrypt = require('bcryptjs');
// const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { Event, Group, Venue, Attendance, EventImage, User, Membership } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();
const { requireAuth } = require('../../utils/auth.js');

const validateEvents = [
    check('name')
        .isLength({min: 5})
        .withMessage("Name must be at least 5 characters"),
    check('type')
        .isIn(['Online', 'In person'])
        .withMessage("Type must be 'Online' or 'In person'"),
    check('capacity')
        .isInt()
        .withMessage("Capacity must be an integer"),
    check('price')
        .isNumeric()
        .withMessage("Price is invalid"),
    check('description')
        .exists()
        .withMessage("Description is required"),
    check('startDate')
        .isAfter(JSON.stringify(new Date()).slice(0, 11) + ' ' + JSON.stringify(new Date()).slice(13, 20))
        .withMessage("Start date must be in the future"),
        handleValidationErrors
    
  ]


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

    if (!event) {
        res.status(404);
        return res.json({
            "message": "Event couldn't be found"
          })
    }
    const imgArray = []
    event.EventImages.forEach((img) => {
        const imgObj = {
            id: img.id,
            url: img.url,
            preview: img.preview
        }
        imgArray.push(imgObj)
})
    const obj = {}
    
            obj.id = event.id,
            obj.groupId = event.groupId,
            obj.venueId = event.venueId,
            obj.name = event.name,
            obj.description = event.description,
            obj.type = event.type,
            obj.capacity = event.capacity,
            obj.price = event.price,
            obj.startDate = event.startDate,
            obj.endDate = event.endDate,
            obj.numAttending = event.Attendances.length,
            obj.Group = {
              id: event.Group.id,
              name: event.Group.name,
              private: event.Group.private,
              city: event.Group.city,
              state: event.Group.state
            },
            obj.Venue = {
                id: event.Venue.id,
                address: event.Venue.address,
                city: event.Venue.city,
                state: event.Venue.state,
                lat: event.Venue.lat,
                lng: event.Venue.lng
            }
            obj.EventImages = imgArray

            if (!event.EventImages) obj.EventImages = null
            if (!event.Group) obj.Group = null
            if (!event.Venue) obj.Venue = null
        

    res.json(obj)
    
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
        include: [Group, Venue, Attendance, EventImage],
        ...pagination
    })
   
    const Events = []
    events.forEach(async (event) => {
     
        const obj = {}
            obj.id = event.id,
            obj.groupId = event.groupId,
            obj.venueId = event.venueId,
            obj.name = event.name,
            obj.type = event.type,
            obj.startDate = event.startDate,
            obj.endDate = event.endDate,
            obj.numAttending = event.Attendances.length,
            obj.previewImage = event.EventImages[0].url,
            obj.Group = {
              id: event.Group.id,
              name: event.Group.name,
              city: event.Group.city,
              state: event.Group.state
            },
            obj.Venue = {
                id: event.Venue.id,
                city: event.Venue.city,
                state: event.Venue.state
            }

            if (!event.EventImages) obj.previewImage = null
            if (!event.Group) obj.Group = null
            if (!event.Venue) obj.Venue = null
            Events.push(obj)
        });

    res.json({
        Events
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
    const eventAttendance = await Event.findByPk(req.params.eventId, {
        include: Attendance
    })

    if (!eventAttendance){
        res.status(404);
        return res.json({
            "message": "Event couldn't be found"
          })
    }
    const statusAttending = eventAttendance.Attendances.find((attendee) => attendee.userId === safeUser.id && (attendee.status.toLowerCase() === 'attending' || attendee.status.toLowerCase() === 'host' || attendee.status.toLowerCase() === 'co-host'))

    if (!statusAttending) {
        res.status(403);
        res.json({
            message: "Require proper authorization: Current User must be an attendee, host, or co-host of the event",
        })
    }
    const newImage = await EventImage.create({
        eventId: req.params.eventId,
        url,
        preview
    });
    const returnObj = {
        id: newImage.id,
        url: newImage.url,
        preview: newImage.preview
    }
    res.json(returnObj)
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

router.put('/:eventId', validateEvents, requireAuth, async (req, res) => {

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

    const {venueId, name, type, capacity, price, description, startDate, endDate} = req.body
    
    const venue = await Venue.findByPk(venueId)
    if(!venue) {
        res.status(404);
        res.json({
            "message": "Venue couldn't be found"
          })
        }
    if (endDate < startDate) {
        res.status(400);
        res.json({
            message: "Bad Request",
            endDate: "End date is less than start date"
        })
    }
    const priceArray = JSON.stringify(price).split('.')
    const length = priceArray[1].length

    if (length > 2) {
        res.status(400);
        res.json({
            message: "Bad Request",
            errors: {
                price: "Price is invalid"
            }
        })
    }

  

    const event = await Event.findByPk(req.params.eventId, {
        include: Group
    });

    if (!event) {
        res.status(404);
        res.json({
            "message": "Event couldn't be found"
          })
    }
    const group = await Group.findByPk(event.Group.id, {
        include: Membership
    });

    
    const autherized = group.Memberships.find((member) => safeUser.id === event.Group.organizerId || (safeUser.id === member.userId && member.status === 'co-host'))

    if (!autherized) {
        res.status(403);
        res.json({
            message: 'Require Authorization: Current User must be the organizer of the group or a member of the group with a status of "co-host"'
        })
    }

    if (venueId !== undefined) event.venueId = venueId;
    if (name !== undefined) event.name = name;
    if (type !== undefined) event.type = type;
    if (capacity !== undefined) event.capacity = capacity;
    if (price !== undefined) event.price = price;
    if (description !== undefined) event.description = description;
    if (startDate !== undefined) event.startDate = startDate;
    if (endDate !== undefined) event.endDate = endDate;

    await event.save()

    const payLoad = {
        id: event.id,
        groupId: event.groupId,
        venueId: event.venueId,
        name: event.name,
        type: event.type,
        capacity: event.capacity,
        price: event.price,
        description: event.description,
        startDate: event.startDate,
        endDate: event.endDate
    }
    res.json(payLoad)
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

    const toDelete = await Event.findByPk(req.params.eventId, {
        include: Group
    })

    if (!toDelete) {
        res.status(404);
        res.json({
            "message": "Event couldn't be found"
          })
    }
    const group = await Group.findByPk(toDelete.Group.id, {
        include: Membership
    })

    const authorized = group.Memberships.find((member) => (member.userId === safeUser.id && member.status === 'co-host') || safeUser.id == group.organizerId)

    if (!authorized) {
        res.status(403);
        res.json({
            message: 'Require Authorization: Current User must be the organizer of the group or a member of the group with a status of "co-host"'
        })
    }
    await toDelete.destroy()
    res.json({
        "message": "Successfully deleted"
      })
});


module.exports = router;
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

    const attendees = await Event.findByPk(req.params.eventId, {
        include: [User, Group]
    });
     
    if (!attendees) {
        res.status(404);
        return res.json({
            "message": "Event couldn't be found"
          })
    }
    const members = await Group.findByPk(attendees.Group.id, {
        include: User
    })
    
    const authorizedMember = members.Users.find((member) => member.Membership.stauts === 'co-host' && safeUser.id === member.Membership.userId)

    if (safeUser.id === members.organizerId || authorizedMember ) {

        let Attendees = []

      
           const user = attendees.Users.find((user) => user.id === user.Attendance.userId);
    
          let newAttendee = {}
            newAttendee.id = user.id
            newAttendee.firstName = user.firstName
            newAttendee.lastName = user.lastName
            newAttendee.Attendance = {status: user.Attendance.status}
    
            Attendees.push(newAttendee)
            
    
        return res.json({Attendees})

    } else {
         
            let Attendees = []

                    const user = attendees.Users.find((user) => user.Attendance.status !== 'pending' && user.id === user.Attendance.userId);
        
                    let newAttendee = {}
                      newAttendee.id = user.id
                      newAttendee.firstName = user.firstName
                      newAttendee.lastName = user.lastName
                      newAttendee.Attendance = {status: user.Attendance.status}
              
                      Attendees.push(newAttendee)
                
              
                
            return res.json({Attendees})
        

    }
    
});


router.get('/:eventId', async (req, res) => {

    const event = await Event.findByPk(req.params.eventId, {
        include: [User, Group, Venue, EventImage]
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
            obj.numAttending = event.Users.length,
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
        

    return res.json(obj)
    
});


router.get('/', async (req, res) => {

    let { page, size } = req.query

    const Events = []

    // if (startDate) {
    //     if (!startDate){
    //         res.status(400);
    //         return res.json({
    //             "message": "Bad Request", 
    //             "errors": {
    //                 "startDate": "Start date must be a valid datetime",
    //             }
    //           })
    //     }

        // const eventByDate = await Event.findAll({
        //     where: {
        //         startDate,
        //     },
        //     include: [Group, Venue, User, EventImage]
        // })

    //     eventByDate.forEach(async (event) => {

    //         let firstImage;
    //     if (event.EventImages.length !== 0) {
    //         firstImage = event.EventImages[0].url
    //     } else {
    //         firstImage = 'none'
    //     }
    //         const obj = {}
    //             obj.id = event.id,
    //             obj.groupId = event.groupId,
    //             obj.venueId = event.venueId,
    //             obj.name = event.name,
    //             obj.type = event.type,
    //             obj.startDate = event.startDate,
    //             obj.endDate = event.endDate,
    //             obj.numAttending = event.Users.length,
    //             obj.previewImage = firstImage,
    //             obj.Group = {
    //               id: event.Group.id,
    //               name: event.Group.name,
    //               city: event.Group.city,
    //               state: event.Group.state
    //             },
    //             obj.Venue = {
    //                 id: event.Venue.id,
    //                 city: event.Venue.city,
    //                 state: event.Venue.state
    //             }
    
    //             if (!event.EventImages) obj.previewImage = null
    //             if (!event.Group) obj.Group = null
    //             if (!event.Venue) obj.Venue = null
    //             Events.push(obj)
    //         });
    
    //     return res.json({
    //         Events
    //     })
    // }
    // if (name) {
    //     if (typeof name !== 'string'){
    //         res.status(400);
    //         return res.json({
    //             "message": "Bad Request", 
    //             "errors": {
    //               "name": "Name must be a string",
    //             }
    //           })
    //     }

    //     const eventName = await Event.findOne({
    //         where: {
    //             name,
    //         },
    //         include: [Group, Venue, Attendance, EventImage]
    //     })
    //     let firstImage;
    //     if (eventName.EventImages.length !== 0) {
    //         firstImage = eventName.EventImages[0].url
    //     } else {
    //         firstImage = 'none'
    //     }
    //     const obj = {}
    //         obj.id = eventName.id,
    //         obj.groupId = eventName.groupId,
    //         obj.venueId = eventName.venueId,
    //         obj.name = eventName.name,
    //         obj.type = eventName.type,
    //         obj.startDate = eventName.startDate,
    //         obj.endDate = eventName.endDate,
    //         obj.numAttending = eventName.Attendances.length,
    //         obj.previewImage = firstImage,
    //         obj.Group = {
    //           id: eventName.Group.id,
    //           name: eventName.Group.name,
    //           city: eventName.Group.city,
    //           state: eventName.Group.state
    //         },
    //         obj.Venue = {
    //             id: eventName.Venue.id,
    //             city: eventName.Venue.city,
    //             state: eventName.Venue.state
    //         }

    //         if (!eventName.EventImages) obj.previewImage = null
    //         if (!eventName.Group) obj.Group = null
    //         if (!eventName.Venue) obj.Venue = null
    //         Events.push(obj)
        

    //     return res.json({Events})
    // }

    if (page) {
        if (page < 1) {
            res.status(400);
            return res.json({
                "message": "Bad Request", 
                "errors": {
                    "page": "Page must be greater than or equal to 1",
                }
            })
        }
    }

    if (size) {
        if (size < 1) {
            res.status(400);
            return res.json({
                "message": "Bad Request", 
                "errors": {
                    "size": "Size must be greater than or equal to 1",
                }
            })
        }
    }

    
    page = parseInt(page);
    size = parseInt(size);

    if (isNaN(page)) page = 1
    if (page > 10) {
        res.status(400);
        return res.json({
            "message": "Bad Request", 
            "errors": {
                "page": "Must be 10 or less",
            }
        })
    }
    if (isNaN(size)) size = 50
    if (size > 50) {
        res.status(400);
        return res.json({
            "message": "Bad Request", 
            "errors": {
                "size": "Size must be 50 or less",
            }
        })
    }

    const pagination = {}
    pagination.limit = size
    pagination.offset = size * (page -1)

    const where = {}
    // if (name) where.name = name
    // if (type) where.type = type
    // if (startDate) where.startDate = startDate
    // if(name === undefined && type === undefined && startDate === undefined) delete where

    const events = await Event.findAll({
        where,
        include: [Group, Venue, User, EventImage],
        ...pagination
    })
   
    
    events.forEach(async (event) => {
        let firstImage;
        if (event.EventImages.length !== 0) {
            firstImage = event.EventImages[event.EventImages.length -1 ]
            firstImage = firstImage.url
        } else {
            firstImage = 'none'
        }
        const obj = {}
            obj.id = event.id,
            obj.groupId = event.groupId,
            obj.venueId = event.venueId,
            obj.name = event.name,
            obj.description = event.description,
            obj.type = event.type,
            obj.startDate = event.startDate,
            obj.endDate = event.endDate,
            obj.numAttending = event.Users.length,
            obj.previewImage = firstImage,
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

    return res.json({
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
        include: [User, Group]
    });

    if (!event) {
        res.status(404);
        return res.json({
            "message": "Event couldn't be found"
          })
    };

    const group = await Group.findByPk(event.Group.id, {
        include: User
    })

    const isMember = group.Users.find((member) => member.Membership.userId === safeUser.id && member.Membership.status !== 'pending')

    if (!isMember) {
        res.status(403);
        return res.json({"message": "Forbidden"})
    }

    event.Users.forEach((attendee) => {
        
        if (attendee.Attendance.userId === safeUser.id) {
            if (attendee.Attendance.status === 'pending') {
                res.status(400);
                return res.json({
                    "message": "Attendance has already been requested"
                  })
            } else {
                res.status(400);
                return res.json({
                    "message": "User is already an attendee of the event"
                  })
            }
            
        }
    })


    const newAttendance = await Attendance.create({
        eventId: req.params.eventId,
        userId: safeUser.id,
        status: 'pending'
    })

    return res.json({
        "userId": safeUser.id,
        "status": "pending"
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
        include: [User, Group]
    })

    if (!eventAttendance){
        res.status(404);
        return res.json({
            "message": "Event couldn't be found"
          })
    }
    

    const statusAttending = eventAttendance.Users.find((attendee) => safeUser.id === attendee.id && attendee.Attendance.status === 'attending')

    const group = await Group.findByPk(eventAttendance.Group.id, {
        include: User
    })

    const hostOrCoHost = group.Users.find((hostOrCoHost) => safeUser.id === hostOrCoHost.id && (hostOrCoHost.Membership.status === 'host' || hostOrCoHost.Membership.status === 'co-host'))

    if (!statusAttending && !hostOrCoHost) {
        res.status(403);
        return res.json({
            "message": "Forbidden"
        })
    }
    const newImage = await EventImage.create({
        eventId: req.params.eventId,
        url,
        preview
    });

    const allImages = await EventImage.findAll()
    
    const returnObj = {
        id: newImage.id,
        url: newImage.url,
        preview: newImage.preview
    }

    return res.json(returnObj)
});


router.put('/:eventId/attendance', requireAuth, async (req, res) => {
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

    const {userId, status} = req.body

    if (status === 'pending') {
        res.status(400);
        return res.json({
            "message": "Bad Request", 
            "errors": {
              "status" : "Cannot change an attendance status to pending"
            }
          })
    };


    const userExists = await User.findByPk(parseInt(userId))
    if (!userExists) {
        res.status(404);
        return res.json({
            "message": "User couldn't be found"
          })
    };


    const event = await Event.findByPk(req.params.eventId, {
        include: [User, Group]
    })

    if(!event) {
        res.status(404);
        return res.json({
            "message": "Event couldn't be found"
          })
    }
    const group = await Group.findByPk(event.Group.id, {
        include: User
    })
    
    const isMember = group.Users.find((member) => safeUser.id === member.Membership.userId)

if (isMember) {
    
    if (safeUser.id !== group.organizerId && isMember.Membership.status !== 'co-host') {
        res.status(403);
        return res.json({
            "message": "Forbidden"
        })
    };
} else {

    if (safeUser.id !== group.organizerId) {
        res.status(403);
        return res.json({
            "message": "Forbidden"
        })
    };
}


    const statusChange = event.Users.find((attend) => parseInt(userId) === attend.Attendance.userId)

    if (!statusChange) {
        res.status(404);
        return res.json({
            "message": "Attendance between the user and the event does not exist"
          })
    };

    const changeAttendance = await Attendance.findOne({
        where: {
            eventId: statusChange.Attendance.eventId,
            userId: statusChange.Attendance.userId
        }
    })

    changeAttendance.status = status

    await changeAttendance.save()
    return res.json({
       
        id: changeAttendance.id,
        eventId: changeAttendance.eventId,
        userId: changeAttendance.userId,
        status: changeAttendance.status
    })
})

router.put('/:eventId', requireAuth, validateEvents, async (req, res) => {

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
        return res.json({
            "message": "Venue couldn't be found"
          })
        }
    if (endDate < startDate) {
        res.status(400);
        return res.json({
            message: "Bad Request",
            endDate: "End date is less than start date"
        })
    }


    const event = await Event.findByPk(req.params.eventId, {
        include: Group
    });

    if (!event) {
        res.status(404);
        return res.json({
            "message": "Event couldn't be found"
          })
    }
    const group = await Group.findByPk(event.Group.id, {
        include: User
    });

   
    const autherized = group.Users.find((coHost) => safeUser.id === coHost.id && coHost.Membership.status == 'co-host')

    if (!autherized && !(safeUser.id === group.organizerId)) {
        res.status(403);
        return res.json({
            "message": "Forbidden"
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

    const priceArray = JSON.stringify(price).split('.')
    const length = priceArray[1].length

    if (length > 2) {
        res.status(400);
        return res.json({
            message: "Bad Request",
            errors: {
                price: "Price is invalid"
            }
        })
    }
    
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
    return res.json(payLoad)
});

router.delete('/:eventId/attendance/:userId', requireAuth, async (req, res) => {

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

    const isUser = await User.findByPk(req.params.userId)
    if (!isUser) {
        res.status(404);
        return res.json({
            "message": "User couldn't be found"
          })
    }
    
    const userAttending = await Event.findByPk(req.params.eventId, {
        include: User
    });

    if (!userAttending) {
        res.status(404);
        return res.json({
            "message": "Event couldn't be found"
          })
    };

    const isHost = userAttending.Users.find((host) => host.Attendance.status === 'host' && safeUser.id === host.Attendance.userId)

    if (parseInt(req.params.userId) !== safeUser.id && !isHost){
        res.status(403);
        return res.json({
            "message": "Forbidden"
        })
    }

    const attendanceExists = userAttending.Users.find((attendee) => parseInt(req.params.userId) === attendee.Attendance.userId)

    if (!attendanceExists) {
        res.status(404);
        return res.json({
            "message": "Attendance does not exist for this User"
          })
    };
    
    const attendanceToDelete = await Attendance.findOne({
        where: {
            userId: req.params.userId,
            eventId: req.params.eventId
        }
    })
    await attendanceToDelete.destroy()

    return res.json({
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
        return res.json({
            "message": "Event couldn't be found"
          })
    }
    const group = await Group.findByPk(toDelete.Group.id, {
        include: User
    })

    const authorized = group.Users.find((member) => (member.Membership.userId === safeUser.id && member.Membership.status === 'co-host') || safeUser.id == group.organizerId)

    if (!authorized) {
        res.status(403);
        return res.json({
            "message": "Forbidden"
        })
    }
    const deleted = await Event.findByPk(req.params.eventId)
   
    await deleted.destroy()
    
    return res.json({
        "message": "Successfully deleted"
      })
});


module.exports = router;
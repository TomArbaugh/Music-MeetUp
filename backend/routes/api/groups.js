const express = require('express');
const { Op } = require('sequelize');
const { sequelize } = require('sequelize');
// const bcrypt = require('bcryptjs');
// const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { Group, GroupImage, Venue, Event, Attendance, Membership, User, EventImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

const { requireAuth } = require('../../utils/auth.js');

const validate = [
    check('name')
      .isLength({max: 60})
      .withMessage("Name must be 60 characters or less"),
    check('about')
      .exists({ checkFalsy: true })
      .isLength({ min: 50 })
      .withMessage("About must be 50 characters or more"),
    check('type')
      .isIn(['Online', 'In person'])
      .withMessage("Type must be 'Online' or 'In person'"),
    check('private')
      .isBoolean()
      .withMessage("Private must be a boolean"),
    check('city')
      .exists()
      .withMessage("City is required"),
    check('state')
      .exists()
      .withMessage("State is required"),
    handleValidationErrors
  ];

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


router.get('/:groupId/members', async (req, res) => {

    const members = await Group.findAll({
       include: [User, Membership],
       where: {
        Id: req.params.groupId
       }
    });

    res.json(members)
});



router.get('/:groupId/events', async (req, res) => {

    const events = await Event.findAll({
        where: {
            groupId: req.params.groupId
        },
        include: [Attendance, Venue, Group, EventImage]
    })
    
    const group = await Group.findByPk(req.params.groupId)
    if (!group) {
        res.status(404);
        return res.json({
            "message": "Group couldn't be found"
          })
    }
    const Events = []
    events.forEach((event) => {
        
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

            if (!event.EventImage) obj.previewImage = null
            if (!event.Group) obj.Group = null
            if (!event.Venue) obj.Venue = null
            Events.push(obj)
        });

    res.json({
        Events
    })
    
});


router.get('/:groupId/venues', requireAuth, async (req, res) => {
    const group = await Group.findByPk(req.params.groupId, {
        include: Venue
    });

    if (!group) {
        res.status(404);
        res.json({
            "message": "Group couldn't be found"
          })
    }
    const Venues = group.Venues
    res.json({Venues})
   
})

router.get('/current', requireAuth, async (req, res) => {
    
    const { user } = req;
      if (user) {
        const safeUser = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          username: user.username,
        }
    
        const Groups = []

        const groups = await Group.findAll({
            include: [Membership, GroupImage]
        })
    
        await groups.forEach((group) => {
           
            let firstImage;
            if (group.GroupImages.length !== 0) {
                firstImage = group.GroupImages[0].url
            } else {
                firstImage = 'none'
            }

            group.Memberships.forEach((membership) => {
                if (membership.userId === safeUser.id ||
                    safeUser.id === group.organizerId){

                        alteredGroup = {
                            id: group.id,
                            organizerId: group.organizerId,
                            name: group.name,
                            about: group.about,
                            type: group.type,
                            private: group.private,
                            city: group.city,
                            state: group.state,
                            createdAt: group.createdAt,
                            updatedAt: group.updatedAt,
                            numMembers: group.Memberships.length,
                            previewImg: firstImage
                        }
                        
                       
                        Groups.push(alteredGroup)
                    }
            });
        
        })
        res.json({Groups})
}

});


router.get('/:groupId/', async (req, res) => {
    
    const groups = await Group.findByPk(req.params.groupId, {
        include: [Membership, GroupImage, Venue, User]
    })

    if (!groups) {
        res.status(404)
        return res.json({
            message: "Group couldn't be found"
        })
    }
       
    const organizer = groups.Users.find((user) => user.id === groups.organizerId)

        alteredGroup = {
            id: groups.id,
            organizerId: groups.organizerId,
            name: groups.name,
            about: groups.about,
            type: groups.type,
            private: groups.private,
            city: groups.city,
            state: groups.state,
            createdAt: groups.createdAt,
            updatedAt: groups.updatedAt,
            numMembers: groups.Memberships.length,
            GroupImages: groups.GroupImages,
            Organizer: {
                id: organizer.id,
                firstName: organizer.firstName,
                lastName: organizer.lastName
            },
            Venues: groups.Venues
        }
        
        
    
    res.json(alteredGroup)
});



router.get('/', async (req, res) => {

    
    const Groups = []

    const groups = await Group.findAll({
        include: [Membership, GroupImage]
    })

    await groups.forEach((group) => {
       
        let firstImage;
        if (group.GroupImages.length !== 0) {
            firstImage = group.GroupImages[0].url
        } else {
            firstImage = 'none'
        }
        alteredGroup = {
            id: group.id,
            organizerId: group.organizerId,
            name: group.name,
            about: group.about,
            type: group.type,
            private: group.private,
            city: group.city,
            state: group.state,
            createdAt: group.createdAt,
            updatedAt: group.updatedAt,
            numMembers: group.Memberships.length,
            previewImg: firstImage
        }
        
        Groups.push(alteredGroup)
    })
    res.json({Groups})
    
});


router.post('/:groupId/membership', requireAuth, async (req, res) => {

    const groupMembership = await Group.findByPk(req.params.groupId, {
        include: Membership
    });
    
    res.json({
        
        memberId: groupMembership.Memberships[0].userId,
        status: groupMembership.Memberships[0].status
    })
});


router.post('/:groupId/events', validateEvents, requireAuth, async (req, res) => {

    let { venueId, name, type, capacity, price, description, startDate, endDate } = req.body

    const venue = await Venue.findByPk(parseInt(venueId))
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
    const group = await Group.findByPk(req.params.groupId, {
        include: Membership
    })

    if(!group){
        res.status(404);
        res.json({
            "message": "Group couldn't be found"
          })
    }
    const memberWithStatus = group.Memberships.find((member) => 
        member.userId === safeUser.id && member.status === 'co-host'
    )
    if (safeUser.id !== group.organizerId && !memberWithStatus) {
        res.status(403);
        res.json({
            message: 'Require Authorization: Current User must be the organizer of the group or a member of the group with a status of "co-host"'
        })
    }
    
    const newEvent = await Event.build({
        groupId: req.params.groupId,
        venueId,
        name,
        type,
        capacity,
        price,
        description,
        startDate,
        endDate
    });

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
    
    await newEvent.save()

    const returnObj = {
        id: newEvent.id,
        groupId: newEvent.groupId,
        venueId: newEvent.venueId,
        name: newEvent.name,
        type: newEvent.type,
        capacity: newEvent.capacity,
        price: newEvent.price,
        description: newEvent.description,
        startDate: newEvent.startDate,
        endDate: newEvent.endDate
    }

    res.json(returnObj)
   
});

router.post('/:groupId/images', requireAuth, async (req, res) => {

    const group = await Group.findByPk(req.params.groupId)
    if (!group){
        res.status(404)
        return res.json({
            "message": "Group couldn't be found"
          })
    }

    
    const { url, preview } = req.body
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
    if (group.organizerId !== safeUser.id) {
        res.status(403)
        return res.json({message: "Require proper authorization: Current User must be the organizer for the group"})
    }
    const newGroupImg = await GroupImage.create({
        url,
        preview
    });
    res.json({
        id: newGroupImg.id,
        url: newGroupImg.url,
        preview: newGroupImg.preview
    })
});

router.post('/:groupId/venues', validateVenues, requireAuth, async (req, res) => {
    const groupId = req.params.groupId
    const group = await Group.findByPk(groupId)
    if (!group) {
        res.status(404);
        res.json({
            "message": "Group couldn't be found"
          });
    }

    const {address, city, state, lat, lng} = req.body

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
    const newVenue = await Venue.create({
        groupId,
        address,
        city,
        state,
        lat,
        lng
    });

    const returnVenue = {
        id: newVenue.id,
        groupId: newVenue.groupId,
        address: newVenue.address,
        city: newVenue.city,
        state: newVenue.state,
        lat: newVenue.lat,
        lng: newVenue.lng,
    }
    res.json(returnVenue)
})

router.post('/', validate, requireAuth, async (req, res) => {
    const { name, about, type, private, city, state } = req.body
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
    const newGroup = await Group.create({
        organizerId: safeUser.id,
        name,
        about,
        type,
        private,
        city,
        state
    });
    res.status(201)
    res.json(newGroup)
});


router.put('/:groupId/membership', requireAuth, async (req, res) => {

    const { memberId, status } = req.body
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
    const group = await Group.findByPk(req.params.groupId, {
        include: Membership
    });

    // const member = group.Memberships.find((member) => member.userId === safeUser.id)

    // if (!member){
    //     res.status(403);
    //     return res.json({message: "Require proper authorization: Group must belong to the current user"})
    // }

    const membership = await Membership.findOne({
        where: {
            userId: group.Memberships[0].userId
        }
    });

    if (status !== undefined) membership.status = status
    
    await membership.save()

    res.json(membership)
});


router.put('/:groupId', validate, requireAuth, async (req, res) => {

    const {organizerId, name, about, type, private, city, state} = req.body

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
    
    const group = await Group.findByPk(req.params.groupId, {
        include: Membership
    })

    if (!group) {
        res.status(404);
        res.json({
            "message": "Group couldn't be found"
          })
    }
    const member = group.Memberships.find((member) => member.userId === safeUser.id)

    if (!member && safeUser.id !== group.organizerId){
        res.status(403);
        return res.json({message: "Require proper authorization: Group must belong to the current user"})
    }
    
    const groups = await Group.findByPk(req.params.groupId)

    if (organizerId !== undefined) groups.organizerId = organizerId
    if (name !== undefined) groups.name = name
    if (about !== undefined) groups.about = about
    if (type !== undefined) groups.type = type
    if (private !== undefined) groups.private = private
    if (city !== undefined) groups.city = city
    if (state !== undefined) groups.state = state
    
    await groups.save()

    res.json(groups)
});

router.delete('/:groupId/membership/:memberId', requireAuth, async (req, res) => {
    const group = await Group.findByPk(req.params.groupId, {
        include: Membership
    });

    const toDelete = group.Memberships.find((membership) =>
        membership.userId === parseInt(req.params.memberId))

        await toDelete.destroy()

        res.json({
  "message": "Successfully deleted membership from group"
})
    
});


router.delete('/:groupId', requireAuth, async (req, res) => {

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
    const group = await Group.findByPk(req.params.groupId, {
        include: Membership
    })

    if (!group) {
        res.status(404);
        res.json({
            "message": "Group couldn't be found"
          })
    }
    const member = group.Memberships.find((member) => member.userId === safeUser.id)

    if (!member && safeUser.id !== group.organizerId){
        res.status(403);
        return res.json({message: "Require proper authorization: Group must belong to the current user"})
    }
    const toDelete = await Group.findByPk(req.params.groupId)
    await toDelete.destroy()

    res.json({
        "message": "Successfully deleted"
      })
});



module.exports = router;
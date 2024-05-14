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
      .isLength({ min: 4 })
      .withMessage("City is required"),
    check('state')
      .exists()
      .isLength({ min: 1})
      .withMessage("State is required"),
    handleValidationErrors
  ];

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
        .isLength({min: 4})
        .withMessage("Description is required"),
    check('startDate')
        .isAfter(JSON.stringify(new Date()).slice(0, 11) + ' ' + JSON.stringify(new Date()).slice(13, 20))
        .withMessage("Start date must be in the future"),
        handleValidationErrors
    
  ]


router.get('/:groupId/members', async (req, res) => {

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

    const members = await Group.findByPk(req.params.groupId, {
       include: [User, Membership],
        
        // include: {
        //     model: User,
        //     through: Membership
        // }
        
    });

    if (!members) {
        res.status(404);
        res.json({
            "message": "Group couldn't be found"
          });
    };

    let authorized = false;


    const Members =  []

    members.Memberships.forEach((member) => {

        if(safeUser.id === member.userId && member.status === 'co-host') authorized = true

        const user = members.Users.find((user) => member.userId === user.id)
        if (safeUser.id === members.organizerId || authorized === true){
            const memberObj = {
                id: member.userId,
                firstName: user.firstName,
                lastName: user.lastName,
                Membership: {
                    status: member.status
                }
            }
            Members.push(memberObj)
        } else {
            if (member.status !== 'pending'){
                const memberObj = {
                    id: member.userId,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    Membership: {
                        status: member.status
                    }
                }
                Members.push(memberObj)
            }
        }
  
    })


    return  res.json({Members})
  
});



router.get('/:groupId/events', async (req, res) => {

    const events = await Event.findAll({
        where: {
            groupId: req.params.groupId
        },
        include: [User, Venue, Group, EventImage]
    })
    
    const group = await Group.findByPk(req.params.groupId)
    if (!group) {
        res.status(404);
        return res.json({
            "message": "Group couldn't be found"
          })
    }
    const Events = []
    events.forEach(async (event) => {
        let firstImage;
        if (event.EventImages.length !== 0) {
            firstImage = event.EventImages[0].url
        } else {
            firstImage = 'none'
        }
        const obj = {}
            obj.id = event.id,
            obj.groupId = event.groupId,
            obj.venueId = event.venueId,
            obj.name = event.name,
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

            
            if (!event.Group) obj.Group = null
            if (!event.Venue) obj.Venue = null
            Events.push(obj)
        });

    res.json({
        Events
    })
    
});


router.get('/:groupId/venues', requireAuth, async (req, res) => {

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
        include: [Venue, User]
    });

    if (!group) {
        res.status(404);
        res.json({
            "message": "Group couldn't be found"
          })
    }
    const Venues = group.Venues

    const isCoHost = group.Users.find((coHost) => safeUser.id === coHost && coHost.Memberhship.status === 'co-host')

    if (safeUser.id === group.organizerId || isCoHost) {
        res.json({Venues})
    } else {
        res.status(403);
        return res.json({
            message: 'Require Authentication: Current User must be the organizer of the group or a member of the group with a status of "co-host"'
        })
    }

   
})

router.get('/current', requireAuth, async (req, res) => {
    
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
    
        const Groups = []

        const groups = await Group.findAll({
            include: [User, GroupImage]
        })
    
        await groups.forEach((group) => {
           
            let firstImage;
            if (group.GroupImages.length !== 0) {
                firstImage = group.GroupImages[0].url
            } else {
                firstImage = 'none'
            }

            
                
                if (safeUser.id === group.organizerId){
                        
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
                            numMembers: group.Users.length,
                            previewImg: firstImage
                        }
                        
                       
                        Groups.push(alteredGroup)
                    }
            
        
        })
        res.json({Groups})
}

});


router.get('/:groupId/', async (req, res) => {
    
    const groups = await Group.findByPk(req.params.groupId, {
        include: [GroupImage, Venue, User]
    })

    if (!groups) {
        res.status(404)
        return res.json({
            message: "Group couldn't be found"
        })
    }
       
    const organizer = await User.findByPk((groups.organizerId))

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
            numMembers: groups.Users.length,
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
        include: [User, GroupImage]
    });

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
            numMembers: group.Users.length,
            previewImg: firstImage
        }
        
        Groups.push(alteredGroup)
    })
    res.json({Groups})
    
});


router.post('/:groupId/membership', requireAuth, async (req, res) => {

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

    const groupMembership = await Group.findByPk(req.params.groupId, {
        include: User
    });

    if(!groupMembership) {
        res.status(404);
        res.json({
            "message": "Group couldn't be found"
          })
    };

    const currentMembership = groupMembership.Users.find((member) => safeUser.id === member.Membership.userId)
   
    if (currentMembership){
        if (currentMembership.status === 'pending') {
            res.status(400);
            return res.json({
                "message": "Membership has already been requested"
              })
        }
    }
   

    if (currentMembership) {
        res.status(400);
        res.json({
            "message": "User is already a member of the group"
          })
    }

  
    const GroupId = parseInt(req.params.groupId)

    const newMembership = await Membership.create({
        userId: safeUser.id,
        groupId: GroupId,
        status: "pending"
    });
    
    res.json({
        
        memberId: newMembership.userId,
        status: newMembership.status
    })
});


router.post('/:groupId/events', requireAuth, validateEvents, async (req, res) => {

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
        include: User
    })

    if(!group){
        res.status(404);
        res.json({
            "message": "Group couldn't be found"
          })
    }
    const memberWithStatus = group.Users.find((member) => member.Membership.status === 'co-host')
    
    
    
    if (safeUser.id !== group.organizerId && !memberWithStatus) {
        res.status(403);
        res.json({
            message: 'Require Authorization: Current User must be the organizer of the group or a member of the group with a status of "co-host"'
        })
    }
    req.params.groupId = parseInt(req.params.groupId)
    const newEvent = await Event.create({
        
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
    

    const attendance = await Attendance.create({
        eventId: newEvent.id,
        userId: safeUser.id,
        status: 'attending'
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
        groupId: req.params.groupId,
        url,
        preview
    });
    res.json({
        id: newGroupImg.id,
        url: newGroupImg.url,
        preview: newGroupImg.preview
    })
});

router.post('/:groupId/venues', requireAuth, validateVenues, async (req, res) => {
    let groupId = req.params.groupId
    const group = await Group.findByPk(groupId)
    if (!group) {
        res.status(404);
        res.json({
            "message": "Group couldn't be found"
          });
    }
groupId = parseInt(groupId)
    const {address, city, state, lat, lng} = req.body


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

router.post('/', requireAuth, validate, async (req, res) => {
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

    const newMembership = await Membership.create({
        userId: safeUser.id,
        groupId: newGroup.id,
        status: 'member'
    })

    res.status(201)
    res.json(newGroup)
});


router.put('/:groupId/membership', requireAuth, async (req, res) => {

    const { memberId, status } = req.body

    if (status === 'pending') {
        res.status(400);
        return res.json({
            "message": "Bad Request", 
            "errors": {
              "status" : "Cannot change a membership status to pending"
            }
          })
    };

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
    };
    
    const group = await Group.findByPk(req.params.groupId, {
        include: User
    });

    if(!group) {
        res.status(404);
        return res.json({
            "message": "Group couldn't be found"
          })
    }

    const userWithMemId = group.Users.find((user) => user.id === memberId)
if (!userWithMemId) {
    res.status(400);
    return res.json('no such user')
}

    // const hasMemberShip = group.Memberships.find((member) => safeUser.id === member.userId)

    const alterMemberShip = group.Users.find((member) => safeUser.id === member.Membership.userId)

 

    if (!alterMemberShip) {
        res.status(404);
        return res.json({
            "message": "User couldn't be found"
          })
    };

    // if (!hasMemberShip) {
    //     res.status(404);
    //     res.json({
    //         "message": "Membership between the user and the group does not exist"
    //       })
    // }
  
    if (safeUser.id === group.organizerId) {
           
            userWithMemId.Membership.status = status

        const membershipChanged = await Membership.findOne({
            where: {
                userId: memberId
            }
            
        });
        membershipChanged.status = status
        await membershipChanged.save()
       

        } else {
            res.status(403);
            res.json({
                "Require proper authorization": {
                    'To change the status from "pending" to "member"': 'Current User must already be the organizer or have a membership to the group with the status of "co-host"',
                    'To change the status from "member" to "co-host"': 'Current User must already be the organizer'
                }
            })
        }
    

 
    
    
    await userWithMemId.save()

    res.json({
        id: memberId,
        groupId: parseInt(req.params.groupId),
        memberId: memberId,
        status: userWithMemId.Membership.status
    })
});


router.put('/:groupId', requireAuth, validate, async (req, res) => {

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
        include: User
    })

    if (!group) {
        res.status(404);
        res.json({
            "message": "Group couldn't be found"
          })
    }
    const member = group.Users.find((member) => member.userId === safeUser.id)

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
        include: User
    });

  
    if (!group) {
        res.status(404);
        res.json({
            "message": "Group couldn't be found"
          })
    };

    if (safeUser.id === parseInt(req.params.memberId) || safeUser.id === group.organizerId) {
        const toDelete = group.Users.find((membership) =>
        membership.Memberhship.userId === parseInt(req.params.memberId))

        if (!toDelete) {
            res.status(404);
            res.json(
                {
                    "message": "Membership does not exist for this User"
                  }
            )
        }
        await toDelete.destroy()

            res.json({
            "message": "Successfully deleted membership from group"
        })
    } else {
        res.status(403);
        res.json({
            'Require proper authorization': 'Current User must be the host of the group, or the user whose membership is being deleted'
        })
    }
   
    
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
    const group = await Group.findOne({
        where: {
            id: req.params.groupId
        },
        include: User
       
    })

    if (!group) {
        res.status(404);
       return res.json({
            "message": "Group couldn't be found"
          })
    }
   
    const member = group.Users.find((member) => member.userId === safeUser.id)

    
    if (!member && safeUser.id !== group.organizerId){
        res.status(403);
        return res.json({message: "Require proper authorization: Group must belong to the current user"})
    }
   
    // await group.destroy()

    res.json({
        "message": "Successfully deleted"
      })
});



module.exports = router;
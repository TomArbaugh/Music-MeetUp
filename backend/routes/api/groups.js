const express = require('express');
const { Op } = require('sequelize');
const { sequelize } = require('sequelize');
// const bcrypt = require('bcryptjs');
// const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { Group, GroupImage, Venue, Event, Attendance, Membership, User } = require('../../db/models');
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
      .isIn(['Online', 'In person', 'Work'])
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

    const Events = await Event.findAll({
        where: {
            groupId: req.params.groupId
        },
        include: [Attendance, Venue]
    })

    res.json({Events})
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
    res.json(group.Venues)
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


router.post('/:groupId/events', requireAuth, async (req, res) => {

    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body

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
    })

    res.json(newEvent)
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

router.post('/:groupId/venues', requireAuth, async (req, res) => {
    const groupId = req.params.groupId
    const group = await Group.findByPk(groupId)
    if (!group) {
        res.status(404);
        res.json({
            "message": "Group couldn't be found"
          });
    }

    const {address, city, state, lat, lng} = req.body

    const newVenue = await Venue.create({
        groupId,
        address,
        city,
        state,
        lat,
        lng
    });
    res.json(newVenue)
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
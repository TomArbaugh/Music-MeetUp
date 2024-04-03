const express = require('express');
const { Op } = require('sequelize');
// const bcrypt = require('bcryptjs');
// const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { Group, GroupImage, Venue } = require('../../db/models');
// const { check } = require('express-validator');
// const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

const { requireAuth } = require('../../utils/auth.js');

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
    
    const groups = await Group.findAll({
        where: {
        organizerId: safeUser.id
            
        }
    })

    res.json({groups})
}

});


router.get('/:groupId/', async (req, res) => {
    
    const group = await Group.findByPk(req.params.groupId)

    if (!group) {
        return res.json({
            message: "Group couldn't be found"
        })
    }
    res.json(group)
});



router.get('/', async (req, res) => {

    const groups = await Group.findAll()
    res.json({groups})
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
        return res.status(403)
    }
    const newGroupImg = await GroupImage.create({
        url,
        preview
    });
    res.json(newGroupImg)
});

router.post('/:groupId/venues', requireAuth, async (req, res) => {
    const groupId = req.params.groupId
    const group = await Group.findByPk(groupId)
    if (!group) {
        res.status(404);
        res.json({
            "message": "Group couldn't be found"
          })
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

router.post('/', requireAuth, async (req, res) => {
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

router.put('/:groupId', requireAuth, async (req, res) => {

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
    
    const group = await Group.findByPk(req.params.groupId)

    if (organizerId !== undefined) group.organizerId = organizerId
    if (name !== undefined) group.name = name
    if (about !== undefined) group.about = about
    if (type !== undefined) group.type = type
    if (private !== undefined) group.private = private
    if (city !== undefined) group.city = city
    if (state !== undefined) group.state = state
    await group.save()

    res.json(group)
});

router.delete('/:groupId', requireAuth, async (req, res) => {

    const toDelete = await Group.findByPk(req.params.groupId)
    await toDelete.destroy()

    res.json({
        "message": "Successfully deleted"
      })
});

module.exports = router;
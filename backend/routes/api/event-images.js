const express = require('express');
const { Op } = require('sequelize');
// const bcrypt = require('bcryptjs');
// const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { EventImage, Event, Membership, Group} = require('../../db/models');
// const { check } = require('express-validator');
// const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

const { requireAuth } = require('../../utils/auth.js');

router.delete('/:imageId', requireAuth, async (req, res) => {

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

    const image = await EventImage.findByPk(req.params.imageId, {
      include: Event
    })

    if (!image) {
      res.status(404);
      res.json({
        "message": "Event Image couldn't be found"
      })
    }

    const event = await Event.findByPk(image.Event.id, {
      include: Group
    })

    const members = await Group.findByPk(event.Group.id, {
      include: Membership
    })

    const isCoHost = members.Memberships.find((member) => member.userId === safeUser.id && member.status === 'co-host')


    if (members.organizerId !== safeUser.id && !isCoHost) {
      res.status(403);
      res.json({
        'Require proper authorization': 'Current user must be the organizer or "co-host" of the Group'
      })
    }
    await image.destroy()
    res.json({
        "message": "Successfully deleted"
      })
})




module.exports = router;
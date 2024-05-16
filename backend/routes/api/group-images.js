const express = require('express');
const { Op } = require('sequelize');
// const bcrypt = require('bcryptjs');
// const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { GroupImage, Group, User} = require('../../db/models');
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
    const image = await GroupImage.findByPk(req.params.imageId, {
      include: Group
    });

    if (!image) {
      res.status(404);
      return res.json({
        "message": "Group Image couldn't be found"
      })
    }
    const members = await Group.findByPk(image.Group.id, {
      include: User
    })

    const isCoHost = members.Users.find((member) => member.Membership.userId === safeUser.id && member.Membership.status === 'co-host')


    if (members.organizerId !== safeUser.id && !isCoHost) {
      res.status(403);
      return res.json({
        'Require proper authorization': 'Current user must be the organizer or "co-host" of the Group'
      })
    }
    
    await image.destroy()
    return res.json({
        "message": "Successfully deleted"
      })
})




module.exports = router;
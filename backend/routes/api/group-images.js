const express = require('express');
const { Op } = require('sequelize');
// const bcrypt = require('bcryptjs');
// const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { GroupImage} = require('../../db/models');
// const { check } = require('express-validator');
// const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

const { requireAuth } = require('../../utils/auth.js');


router.delete('/:imageId', requireAuth, async (req, res) => {
    const image = await GroupImage.findByPk(req.params.imageId)
    await image.destroy()
    res.json({
        "message": "Successfully deleted"
      })
})




module.exports = router;
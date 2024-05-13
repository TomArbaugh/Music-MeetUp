'use strict';
const { Attendance } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   await Attendance.bulkCreate([
    {
      eventId: 1,
      userId: 1,
      status: 'attending'
    },
    {
      eventId: 2,
      userId: 2,
      status: 'attending'
    },
    {
      eventId: 3,
      userId: 3,
      status: 'attending'
    },
    {
      eventId: 4,
      userId: 13,
      status: 'attending'
    },
    {
      eventId: 5,
      userId: 11,
      status: 'attending'
    },
    {
      eventId: 6,
      userId: 20,
      status: 'attending'
    },
    {
      eventId: 7,
      userId: 16,
      status: 'attending'
    },
    {
      eventId: 8,
      userId: 10,
      status: 'attending'
    },
    {
      eventId: 9,
      userId: 9,
      status: 'attending'
    },
    {
      eventId: 10,
      userId: 18,
      status: 'attending'
    },  
    {
      eventId: 11,
      userId: 19,
      status: 'attending'
    },
    {
      eventId: 12,
      userId: 17,
      status: 'attending'
    },
    {
      eventId: 13,
      userId: 15,
      status: 'attending'
    },
    {
      eventId: 14,
      userId: 14,
      status: 'attending'
    },
    {
      eventId: 15,
      userId: 4,
      status: 'attending'
    },
    {
      eventId: 16,
      userId: 6,
      status: 'attending'
    },
    {
      eventId: 17,
      userId: 7,
      status: 'attending'
    },
    {
      eventId: 18,
      userId: 5,
      status: 'attending'
    },
    {
      eventId: 19,
      userId: 8,
      status: 'attending'
    },
    {
      eventId: 20,
      userId: 12,
      status: 'attending'
    }
   ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Attendances';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      userId: { [Op.between]: [1, 20] }
    }, {});
  }
};

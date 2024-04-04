'use strict';
const { Event } = require('../models');
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
    await Event.bulkCreate([
      {
        venueId: 1,
        groupId: 1,
        name: 'EventNameOne',
        description: 'eventOneDescrip',
        type: 'Online',
        capacity: 100,
        price: 12,
        startDate: '2025-01-01',
        endDate: '2026-01-01'
      },
      {
        venueId: 2,
        groupId: 2,
        name: 'EventNameTwo',
        description: 'eventTWODescrip',
        type: 'In person',
        capacity: 10,
        price: 90,
        startDate: '2025-01-01',
        endDate: '2026-01-01'
      },
      {
        venueId: 3,
        groupId: 3,
        name: 'EventNameThree',
        description: 'eventtHREEDescrip',
        type: 'Online',
        capacity: 900,
        price: 212,
        startDate: '2025-01-01',
        endDate: '2026-01-01'
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
    options.tableName = 'Events';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      venueId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};

'use strict';
const { Group } = require('../models');
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
    await Group.bulkCreate([
      {
        organizerId: 1,
        name: 'GroupOne',
        about: 'firstAbout',
        type: 'Online',
        private: true,
        city: 'Seattle',
        state: 'WA',
      },
      {
        organizerId: 2,
        name: 'GroupTwo',
        about: 'secondAbout',
        type: 'In person',
        private: true,
        city: 'LA',
        state: 'CA',
      },
      {
        organizerId: 3,
        name: 'GroupThree',
        about: 'thirdAbout',
        type: 'Online',
        private: false,
        city: 'New York',
        state: 'NY',
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
    options.tableName = 'Groups';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      organizerId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};

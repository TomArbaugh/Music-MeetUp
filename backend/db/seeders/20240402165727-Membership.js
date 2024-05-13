'use strict';
const { Membership } = require('../models');
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
   await Membership.bulkCreate([
    {
      userId: 1,
      groupId: 1,
      status: 'host'
    },
    {
      userId: 2,
      groupId: 1,
      status: 'co-host'
    },
    {
      userId: 3,
      groupId: 1,
      status: 'member'
    },
    {
      userId: 7,
      groupId: 1,
      status: 'member'
    },
    {
      userId: 2,
      groupId: 2,
      status: 'host'
    },
    {
      userId: 4,
      groupId: 2,
      status: 'co-host'
    },
    {
      userId: 8,
      groupId: 2,
      status: 'member'
    },
    {
      userId: 3,
      groupId: 3,
      status: 'co-host'
    },
    {
      userId: 20,
      groupId: 3,
      status: 'member'
    },
    {
      userId: 19,
      groupId: 3,
      status: 'host'
    },
    {
      userId: 4,
      groupId: 15,
      status: 'host'
    },
    {
      userId: 5,
      groupId: 18,
      status: 'host'
    },
    {
      userId: 6,
      groupId: 16,
      status: 'host'
    },
    {
      userId: 7,
      groupId: 17,
      status: 'host'
    },
    {
      userId: 8,
      groupId: 19,
      status: 'host'
    },
    {
      userId: 9,
      groupId: 9,
      status: 'host'
    },
    {
      userId: 10,
      groupId: 8,
      status: 'host'
    },
    {
      userId: 11,
      groupId: 5,
      status: 'host'
    },
    {
      userId: 12,
      groupId: 20,
      status: 'host'
    },
    {
      userId: 13,
      groupId: 4,
      status: 'host'
    },
    {
      userId: 14,
      groupId: 14,
      status: 'host'
    },
    {
      userId: 15,
      groupId: 13,
      status: 'host'
    },
    {
      userId: 16,
      groupId: 7,
      status: 'host'
    },
    {
      userId: 17,
      groupId: 12,
      status: 'host'
    },
    {
      userId: 18,
      groupId: 10,
      status: 'host'
    },
    {
      userId: 19,
      groupId: 11,
      status: 'host'
    },
    {
      userId: 20,
      groupId: 6,
      status: 'host'
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
    options.tableName = 'Memberships';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      userId: { [Op.between]: [1, 20] }
    }, {});
  }
};

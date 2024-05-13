'use strict';
const { EventImage } = require('../models');
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
    await EventImage.bulkCreate([
      {
        eventId: 1,
        url: 'URLeventimageOne',
        preview: true
      },
      {
        eventId: 2,
        url: 'URLeventImgeTwo',
        preview: false
      },
      {
        eventId: 3,
        url: 'URLeventImageThree',
        preview: false
      },
      {
        eventId: 4,
        url: 'URLeventimage4',
        preview: true
      },
      {
        eventId: 5,
        url: 'URLeventImge5',
        preview: false
      },
      {
        eventId: 6,
        url: 'URLeventImage6',
        preview: false
      },
      {
        eventId: 7,
        url: 'URLeventimage7',
        preview: true
      },
      {
        eventId: 8,
        url: 'URLeventImge8',
        preview: false
      },
      {
        eventId: 9,
        url: 'URLeventImage9',
        preview: false
      },
      {
        eventId: 10,
        url: 'URLeventimage10',
        preview: true
      },
      {
        eventId: 11,
        url: 'URLeventImge11',
        preview: false
      },
      {
        eventId: 12,
        url: 'URLeventImage12',
        preview: false
      },
      {
        eventId: 13,
        url: 'URLeventimage13',
        preview: true
      },
      {
        eventId: 14,
        url: 'URLeventImge14',
        preview: false
      },
      {
        eventId: 15,
        url: 'URLeventImage15',
        preview: false
      },
      {
        eventId: 16,
        url: 'URLeventimage16',
        preview: true
      },
      {
        eventId: 17,
        url: 'URLeventImge17',
        preview: false
      },
      {
        eventId: 18,
        url: 'URLeventImage18',
        preview: false
      },
      {
        eventId: 19,
        url: 'URLeventimage19',
        preview: true
      },
      {
        eventId: 20,
        url: 'URLeventImge20',
        preview: false
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
    options.tableName = 'EventImage';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      eventId: { [Op.between]: [1, 20] }
    }, {});
  }
};

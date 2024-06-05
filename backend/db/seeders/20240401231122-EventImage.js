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
        url: 'https://tomsmusicbucket.s3.us-west-2.amazonaws.com/event-images/Image+6-5-24+at+12.42%E2%80%AFPM.jpg',
        preview: true
      },
      {
        eventId: 2,
        url: 'https://tomsmusicbucket.s3.us-west-2.amazonaws.com/event-images/Image+6-5-24+at+12.43%E2%80%AFPM.jpg',
        preview: false
      },
      {
        eventId: 3,
        url: 'https://tomsmusicbucket.s3.us-west-2.amazonaws.com/event-images/Image+6-5-24+at+12.45%E2%80%AFPM.jpg',
        preview: false
      },
      {
        eventId: 4,
        url: 'https://tomsmusicbucket.s3.us-west-2.amazonaws.com/event-images/Image+6-5-24+at+12.47%E2%80%AFPM.jpg',
        preview: true
      },
      {
        eventId: 5,
        url: 'https://tomsmusicbucket.s3.us-west-2.amazonaws.com/event-images/Image+6-5-24+at+12.51%E2%80%AFPM.jpg',
        preview: false
      },
      {
        eventId: 6,
        url: 'https://tomsmusicbucket.s3.us-west-2.amazonaws.com/event-images/Image+6-5-24+at+12.52%E2%80%AFPM.jpg',
        preview: false
      },
      {
        eventId: 7,
        url: 'https://tomsmusicbucket.s3.us-west-2.amazonaws.com/event-images/Image+6-5-24+at+12.53%E2%80%AFPM.jpg',
        preview: true
      },
      {
        eventId: 8,
        url: 'https://tomsmusicbucket.s3.us-west-2.amazonaws.com/event-images/Image+6-5-24+at+12.54%E2%80%AFPM.jpg',
        preview: false
      },
      {
        eventId: 9,
        url: 'https://tomsmusicbucket.s3.us-west-2.amazonaws.com/event-images/Image+6-5-24+at+12.55%E2%80%AFPM.jpg',
        preview: false
      },
      {
        eventId: 10,
        url: 'https://tomsmusicbucket.s3.us-west-2.amazonaws.com/event-images/Image+6-5-24+at+12.57%E2%80%AFPM.jpg',
        preview: true
      },
      {
        eventId: 11,
        url: 'https://tomsmusicbucket.s3.us-west-2.amazonaws.com/event-images/Image+6-5-24+at+12.58%E2%80%AFPM.jpg',
        preview: false
      },
      {
        eventId: 12,
        url: 'https://tomsmusicbucket.s3.us-west-2.amazonaws.com/event-images/Image+6-5-24+at+1.00%E2%80%AFPM.jpg',
        preview: false
      },
      {
        eventId: 13,
        url: 'https://tomsmusicbucket.s3.us-west-2.amazonaws.com/event-images/Image+6-5-24+at+1.00%E2%80%AFPM+2.jpg',
        preview: true
      },
      {
        eventId: 14,
        url: 'https://tomsmusicbucket.s3.us-west-2.amazonaws.com/event-images/Image+6-5-24+at+1.02%E2%80%AFPM.jpg',
        preview: false
      },
      {
        eventId: 15,
        url: 'https://tomsmusicbucket.s3.us-west-2.amazonaws.com/event-images/Image+6-5-24+at+1.04%E2%80%AFPM.jpg',
        preview: false
      },
      {
        eventId: 16,
        url: 'https://tomsmusicbucket.s3.us-west-2.amazonaws.com/event-images/Image+6-5-24+at+1.04%E2%80%AFPM+2.jpg',
        preview: true
      },
      {
        eventId: 17,
        url: 'https://tomsmusicbucket.s3.us-west-2.amazonaws.com/event-images/Image+6-5-24+at+1.07%E2%80%AFPM.jpg',
        preview: false
      },
      {
        eventId: 18,
        url: 'https://tomsmusicbucket.s3.us-west-2.amazonaws.com/event-images/Image+6-5-24+at+1.07%E2%80%AFPM+2.jpg',
        preview: false
      },
      {
        eventId: 19,
        url: 'https://tomsmusicbucket.s3.us-west-2.amazonaws.com/event-images/Image+6-5-24+at+1.08%E2%80%AFPM.jpg',
        preview: true
      },
      {
        eventId: 20,
        url: 'https://tomsmusicbucket.s3.us-west-2.amazonaws.com/event-images/Image+6-5-24+at+1.10%E2%80%AFPM.jpg',
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

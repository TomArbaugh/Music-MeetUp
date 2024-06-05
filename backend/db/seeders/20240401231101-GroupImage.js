'use strict';
const { GroupImage } = require('../models');
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
    await GroupImage.bulkCreate([
      {
        groupId: 1,
        url: 'https://tomsmusicbucket.s3.us-west-2.amazonaws.com/group-images/group-1.jpg',
        preview: false,
      
      },
      {
        groupId: 2,
        url: 'https://tomsmusicbucket.s3.us-west-2.amazonaws.com/group-images/group-2.jpg',
        preview: true,
      
      },
      {
        groupId: 3,
        url: 'https://tomsmusicbucket.s3.us-west-2.amazonaws.com/group-images/group-3.jpg',
        preview: false,
     
      },
      {
        groupId: 4,
        url: 'https://tomsmusicbucket.s3.us-west-2.amazonaws.com/group-images/group-4.jpg',
        preview: false,
      
      },
      {
        groupId: 5,
        url: 'https://tomsmusicbucket.s3.us-west-2.amazonaws.com/group-images/group-5.jpg',
        preview: true,
      
      },
      {
        groupId: 6,
        url: 'https://tomsmusicbucket.s3.us-west-2.amazonaws.com/group-images/group-6.jpg',
        preview: false,
     
      },
      {
        groupId: 7,
        url: 'https://tomsmusicbucket.s3.us-west-2.amazonaws.com/group-images/group-7.jpg',
        preview: false,
      
      },
      {
        groupId: 8,
        url: 'https://tomsmusicbucket.s3.us-west-2.amazonaws.com/group-images/group-8.jpg',
        preview: true,
      
      },
      {
        groupId: 9,
        url: 'https://tomsmusicbucket.s3.us-west-2.amazonaws.com/group-images/group-9.jpg',
        preview: false,
     
      },
      {
        groupId: 10,
        url: 'https://tomsmusicbucket.s3.us-west-2.amazonaws.com/group-images/group-10.jpg',
        preview: false,
      
      },
      {
        groupId: 11,
        url: 'https://tomsmusicbucket.s3.us-west-2.amazonaws.com/group-images/group-11.jpg',
        preview: true,
      
      },
      {
        groupId: 12,
        url: 'https://tomsmusicbucket.s3.us-west-2.amazonaws.com/group-images/group-12.jpg',
        preview: false,
     
      },
      {
        groupId: 13,
        url: 'https://tomsmusicbucket.s3.us-west-2.amazonaws.com/group-images/group-13.jpg',
        preview: false,
      
      },
      {
        groupId: 14,
        url: 'https://tomsmusicbucket.s3.us-west-2.amazonaws.com/group-images/group-14.jpg',
        preview: true,
      
      },
      {
        groupId: 15,
        url: 'https://tomsmusicbucket.s3.us-west-2.amazonaws.com/group-images/group-15.jpg',
        preview: false,
     
      },
      {
        groupId: 16,
        url: 'https://tomsmusicbucket.s3.us-west-2.amazonaws.com/group-images/group-16.jpg',
        preview: false,
      
      },
      {
        groupId: 17,
        url: 'https://tomsmusicbucket.s3.us-west-2.amazonaws.com/group-images/group-17.jpg',
        preview: true,
      
      },
      {
        groupId: 18,
        url: 'https://tomsmusicbucket.s3.us-west-2.amazonaws.com/group-images/group-18.jpg',
        preview: false,
     
      },
      {
        groupId: 19,
        url: 'https://tomsmusicbucket.s3.us-west-2.amazonaws.com/group-images/group-19.jpg',
        preview: false,
      
      },
      {
        groupId: 20,
        url: 'https://tomsmusicbucket.s3.us-west-2.amazonaws.com/group-images/group-20.jpg',
        preview: true,
      
      },
      {
        groupId: 1,
        url: 'https://tomsmusicbucket.s3.us-west-2.amazonaws.com/event-images/Image+6-5-24+at+12.56%E2%80%AFPM.jpg',
        preview: false,
     
      },
      {
        groupId: 2,
        url: 'https://tomsmusicbucket.s3.us-west-2.amazonaws.com/event-images/Image+6-5-24+at+12.56%E2%80%AFPM.jpg',
        preview: true,
      
      },
      {
        groupId: 3,
        url: 'https://tomsmusicbucket.s3.us-west-2.amazonaws.com/event-images/Image+6-5-24+at+12.56%E2%80%AFPM.jpg',
        preview: false,
     
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
    options.tableName = 'GroupImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      groupId: { [Op.between]: [1, 20] }
    }, {});
  }
};

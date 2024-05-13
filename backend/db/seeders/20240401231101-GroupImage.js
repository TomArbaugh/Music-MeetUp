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
        url: 'validURLaddress',
        preview: false,
      
      },
      {
        groupId: 2,
        url: 'validURLaddress2',
        preview: true,
      
      },
      {
        groupId: 3,
        url: 'validURLAddress3',
        preview: false,
     
      },
      {
        groupId: 4,
        url: 'validURLaddress4',
        preview: false,
      
      },
      {
        groupId: 5,
        url: 'validURLaddress5',
        preview: true,
      
      },
      {
        groupId: 6,
        url: 'validURLAddress6',
        preview: false,
     
      },
      {
        groupId: 7,
        url: 'validURLaddress7',
        preview: false,
      
      },
      {
        groupId: 8,
        url: 'validURLaddress8',
        preview: true,
      
      },
      {
        groupId: 9,
        url: 'validURLAddress9',
        preview: false,
     
      },
      {
        groupId: 10,
        url: 'validURLaddress10',
        preview: false,
      
      },
      {
        groupId: 11,
        url: 'validURLaddress11',
        preview: true,
      
      },
      {
        groupId: 12,
        url: 'validURLAddress12',
        preview: false,
     
      },
      {
        groupId: 13,
        url: 'validURLaddress13',
        preview: false,
      
      },
      {
        groupId: 14,
        url: 'validURLaddress14',
        preview: true,
      
      },
      {
        groupId: 15,
        url: 'validURLAddress15',
        preview: false,
     
      },
      {
        groupId: 16,
        url: 'validURLaddress16',
        preview: false,
      
      },
      {
        groupId: 17,
        url: 'validURLaddress17',
        preview: true,
      
      },
      {
        groupId: 18,
        url: 'validURLAddress18',
        preview: false,
     
      },
      {
        groupId: 19,
        url: 'validURLaddress19',
        preview: false,
      
      },
      {
        groupId: 20,
        url: 'validURLaddress20',
        preview: true,
      
      },
      {
        groupId: 1,
        url: 'validURLAddress1again',
        preview: false,
     
      },
      {
        groupId: 2,
        url: 'validURLaddress2again',
        preview: true,
      
      },
      {
        groupId: 3,
        url: 'validURLAddress3again',
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

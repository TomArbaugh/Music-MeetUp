'use strict';
const { Venue } = require('../models');
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
    await Venue.bulkCreate([
      {
        groupId: 1,
        address: '2505 1st Ave, Seattle, WA 98121',
        city: 'Seattle',
        state: 'WA',
        lat: '47.6148',
        lng: '-122.3493'
      },
      {
        groupId: 2,
        address: '8901 Sunset Blvd, West Hollywood, CA 90069',
        city: 'LA',
        state: 'CA',
        lat: '34.0908',
        lng: '-118.3858'
      },
      {
        groupId: 3,
        address: '4 Pennsylvania Plaza, New York, NY 10001',
        city: 'New York',
        state: 'NY',
        lat: '40.7505',
        lng: '-73.993324'
      },
      {
        groupId: 4,
        address: '131 W 3rd St, New York, NY 10012',
        city: 'New York',
        state: 'NY',
        lat: '40.7309',
        lng: '-74.0007'
      },
      {
        groupId: 5,
        address: '1101 23rd Ave SE, Puyallup, WA 98374',
        city: 'Puyallup',
        state: 'WA',
        lat: '47.1706',
        lng: '-122.2793'
      },
      {
        groupId: 6,
        address: '901 Broadway, Tacoma, WA 98402',
        city: 'Tacoma',
        state: 'WA',
        lat: '47.2551',
        lng: '-122.4402'
      },
      {
        groupId: 7,
        address: '774 Portland Rd, Saco, ME 04072',
        city: 'Saco',
        state: 'ME',
        lat: '43.5286683',
        lng: '-70.4345387'
      },
      {
        groupId: 8,
        address: '450 Jane Stanford Way, Stanford, CA 94305',
        city: 'Stanford',
        state: 'CA',
        lat: '37.4277',
        lng: '-122.165413'
      },
      {
        groupId: 9,
        address: '200 University St, Seattle, WA 98101',
        city: 'Seattle',
        state: 'WA',
        lat: '47.6082',
        lng: '-122.3368'
      },
      {
        groupId: 10,
        address: '2800 Opryland Dr, Nashville, TN 37214',
        city: 'Nashville',
        state: 'TN',
        lat: '36.2122',
        lng: '-86.6946'
      },
      {
        groupId: 11,
        address: '1001 Stadium Dr, Inglewood, CA 90301',
        city: 'Inglewood',
        state: 'CA',
        lat: '33.9535',
        lng: '-118.339630'
      },
      {
        groupId: 12,
        address: '60 Lincoln Center Plaza, New York, NY 10023',
        city: 'New York',
        state: 'NY',
        lat: '40.7738',
        lng: '-73.9828'
      },
      {
        groupId: 13,
        address: '8390 Westheimer Rd, Houston, TX 77063',
        city: 'Houston',
        state: 'TX',
        lat: '29.7400216',
        lng: '-95.5957516'
      },
      {
        groupId: 14,
        address: '253 W 125th St, New York, NY 10027',
        city: 'New York',
        state: 'NY',
        lat: '40.8100',
        lng: '-73.9501'
      },
      {
        groupId: 15,
        address: 'Newport, RI 02840',
        city: 'Newport',
        state: 'RI',
        lat: '41.4799007',
        lng: '-71.3788099'
      },
      {
        groupId: 16,
        address: '12499 USF Bull Run Drive, Tampa, FL 33617',
        city: 'Tampa',
        state: 'FL',
        lat: '28.0592361',
        lng: '-82.4064722'
      },
      {
        groupId: 17,
        address: '6215 Sunset Blvd, Los Angeles, CA 90028',
        city: 'LA',
        state: 'CA',
        lat: '34.0985',
        lng: '-118.3243'
      },
      {
        groupId: 18,
        address: '150 Convent Ave, New York, NY 10031',
        city: 'New York',
        state: 'NY',
        lat: '40.8184',
        lng: '-73.9515'
      },
      {
        groupId: 19,
        address: '1928 Poplar Ave, Memphis, TN 38104',
        city: 'Memphis',
        state: 'TN',
        lat: '35.146389',
        lng: '-89.989167'
      },
      {
        groupId: 20,
        address: '1502 11th Ave, Milton, WA 98354',
        city: 'Milton',
        state: 'WA',
        lat: '47.2463',
        lng: '-122.3203'
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
    options.tableName = 'Venues';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      groupId: { [Op.between]: [1, 20] }
    }, {});
    
  }
};

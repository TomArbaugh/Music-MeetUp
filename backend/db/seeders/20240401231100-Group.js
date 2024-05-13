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
        name: 'The-Voodoo-Chiles',
        about: 'This group will redifine rock and rolll',
        type: 'Online',
        private: true,
        city: 'Seattle',
        state: 'WA',
      },
      {
        organizerId: 2,
        name: 'Eric and the Dominoes',
        about: 'This is not Derek and the Dominoes. No one knows who Derek is.',
        type: 'In person',
        private: true,
        city: 'LA',
        state: 'CA',
      },
      {
        organizerId: 3,
        name: 'Concrete Blimp',
        about: 'Let try this again.',
        type: 'Online',
        private: false,
        city: 'New York',
        state: 'NY',
      },
      {
        organizerId: 13,
        name: 'Copy Cats',
        about: 'This group sets out to prove that we can do what the greats have done.',
        type: 'Online',
        private: true,
        city: 'New York',
        state: 'NY',
      },
      {
        organizerId: 11,
        name: 'Never Mind',
        about: 'Really great band thats about to start. Definitly a good band to be in. Auditions welcome.',
        type: 'In person',
        private: false,
        city: 'Puyallup',
        state: 'WA',
      },
      {
        organizerId: 20,
        name: 'Edgar Meyer and Friends',
        about: 'Don\'t tell Yo-Yo Ma about this.',
        type: 'In person',
        private: false,
        city: 'Tacoma',
        state: 'WA',
      },
      {
        organizerId: 16,
        name: 'The Butter Pies',
        about: 'The butter wouldn\'t melt, so I put it in the pie. Then, I started a band of only bass players. Do you have what it takes?',
        type: 'Online',
        private: true,
        city: 'Saco',
        state: 'ME',
      },
      {
        organizerId: 10,
        name: 'Speak More Elequently To Me',
        about: 'This new project it based off of my 2024 album, but will be a different take (or many).',
        type: 'Online',
        private: false,
        city: 'New York',
        state: 'NY',
      },
      {
        organizerId: 9,
        name: 'Four Seasons',
        about: 'This group will focus on learning each movement of Vivaldi\'s four seasons over the course of a year.',
        type: 'Online',
        private: false,
        city: 'Seattle',
        state: 'WA',
      },
      {
        organizerId: 18,
        name: 'Billy but Better',
        about: 'Billy Joel cover band',
        type: 'In person',
        private: true,
        city: 'Nashville',
        state: 'TN',
      },
      {
        organizerId: 19,
        name: 'Hit Me Baby One More Time!',
        about: 'Time to make some more hits!',
        type: 'Online',
        private: false,
        city: 'LA',
        state: 'CA',
      },
      {
        organizerId: 17,
        name: 'The Beattles',
        about: 'We are currently looking for a new bass player.',
        type: 'In person',
        private: true,
        city: 'New York',
        state: 'NY',
      },
      {
        organizerId: 15,
        name: 'Guitar Pickers',
        about: 'Gotta guitar? Gotta guitar...',
        type: 'Online',
        private: false,
        city: 'Houston',
        state: 'TX',
      },
      {
        organizerId: 14,
        name: 'Love Songs',
        about: 'Lets sing some love songs together.',
        type: 'In person',
        private: false,
        city: 'New York',
        state: 'NY',
      },
      {
        organizerId: 4,
        name: 'Listen to this.',
        about: 'Listen closley! My guitar is speaking to you.',
        type: 'In person',
        private: false,
        city: 'New York',
        state: 'NY',
      },
      {
        organizerId: 6,
        name: 'Your Lesson',
        about: 'Prepare to become a better musician by learning from me, the greatest ever.',
        type: 'In person',
        private: false,
        city: 'Tampa',
        state: 'FL',
      },
      {
        organizerId: 7,
        name: 'Punk Jazz',
        about: 'I have turned a song into a genre.',
        type: 'In person',
        private: false,
        city: 'LA',
        state: 'CA',
      },
      {
        organizerId: 5,
        name: 'Scat-Shop',
        about: 'Can you emulate Louis Armstrong? How about emulating his trumpet with only your voice? Come find out!',
        type: 'In person',
        private: false,
        city: 'New York',
        state: 'NY',
      },
      {
        organizerId: 8,
        name: 'Guitarist Only',
        about: 'This is a space for guitarists to talk about guitars and guitar related things. 6 string minimum.',
        type: 'Online',
        private: false,
        city: 'New York',
        state: 'NY',
      },
      {
        organizerId: 12,
        name: 'Helicopter-Whales',
        about: 'This jazz experience commemorates... Never Mind',
        type: 'Online',
        private: true,
        city: 'Milton',
        state: 'WA',
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
      organizerId: { [Op.between]: [1, 20] }
    }, {});
  }
};

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
        name: 'Wood Stock II',
        description: 'Jimi and friends shred.',
        type: 'In person',
        capacity: 750,
        price: 12,
        startDate: '2025-01-01',
        endDate: '2025-01-03'
      },
      {
        venueId: 2,
        groupId: 2,
        name: 'Tribute to BB',
        description: 'Blues Jam',
        type: 'In person',
        capacity: 10,
        price: 90,
        startDate: '2025-01-01',
        endDate: '2026-01-01'
      },
      {
        venueId: 3,
        groupId: 3,
        name: 'Get the LED out',
        description: 'Led Zeppelin Cover Band',
        type: 'In person',
        capacity: 19500,
        price: 212,
        startDate: '2025-01-01',
        endDate: '2026-01-01'
      },
      {
        venueId: 4,
        groupId: 4,
        name: 'Playing Like Ray Brown',
        description: 'Bromberg plays like Ray Brown while Al Di Meola improvises Beattles inspired accoustic shreds.',
        type: 'In person',
        capacity: 300,
        price: 12,
        startDate: '2025-01-01',
        endDate: '2026-01-01'
      },
      {
        venueId: 5,
        groupId: 5,
        name: 'Party',
        description: 'Lets get together and jam some great tunes around the camp fire.',
        type: 'In person',
        capacity: 100,
        price: 0,
        startDate: '2025-01-01',
        endDate: '2026-01-01'
      },
      {
        venueId: 6,
        groupId: 6,
        name: 'Secret Concert',
        description: 'In this concert, Edgar Meyer and all of Yo-Yo Ma\'s other friends will perfrom original works.',
        type: 'Online',
        capacity: 2703,
        price: 112,
        startDate: '2025-01-01',
        endDate: '2026-01-01'
      },
      {
        venueId: 7,
        groupId: 7,
        name: 'Lets talk bass',
        description: 'As we all know, bass is the only instrument needed to make a great band. The more basses you have, the better. Lets talk about it.',
        type: 'Online',
        capacity: 100,
        price: 12,
        startDate: '2025-01-01',
        endDate: '2026-01-01'
      },
      {
        venueId: 8,
        groupId: 8,
        name: 'After The Thesaurus',
        description: 'Help me spruce up my album by finding more interesting ways to convey the emotions these songs embody.',
        type: 'In person',
        capacity: 30,
        price: 900,
        startDate: '2025-01-01',
        endDate: '2026-01-01'
      },
      {
        venueId: 9,
        groupId: 9,
        name: 'Four Seasons',
        description: 'Joshua Bell to perform Vivaldi Four Seasons in entirety as an example of the final product members of this group will learn to play.',
        type: 'In person',
        capacity: 2500,
        price: 112,
        startDate: '2025-01-01',
        endDate: '2026-01-01'
      },
      {
        venueId: 10,
        groupId: 10,
        name: 'Candle In the Wind',
        description: 'We didn\'t start the fire! But we will rock the night away. Come Just The Way You Are.',
        type: 'In person',
        capacity: 2362,
        price: 1200,
        startDate: '2025-01-01',
        endDate: '2026-01-01'
      },
      {
        venueId: 11,
        groupId: 11,
        name: 'Britney\'s Back',
        description: 'Britney Spears to the stage.',
        type: 'In person',
        capacity: 70000,
        price: 900,
        startDate: '2025-01-01',
        endDate: '2026-01-01'
      },
      {
        venueId: 12,
        groupId: 12,
        name: 'Bass Auditions',
        description: 'The Beattles are looking for a new bass palyer. If you would like to join John, George, and Ringo in the past for a blast, make sure to sign up for your audition today!',
        type: 'Online',
        capacity: 900,
        price: 5,
        startDate: '2025-01-01',
        endDate: '2026-01-01'
      },
      {
        venueId: 13,
        groupId: 13,
        name: 'Guitar Picking',
        description: 'Come to Guitar Center in Houston and see who can play the fastest and loudest guitar part!',
        type: 'In person',
        capacity: 350,
        price: 1,
        startDate: '2025-01-01',
        endDate: '2026-01-01'
      },
      {
        venueId: 14,
        groupId: 14,
        name: 'A Night with Ms. Billy',
        description: 'To be serenaded by one of the greatest Jazz singers of all time, sign up here.',
        type: 'In person',
        capacity: 10,
        price: 90,
        startDate: '2025-01-01',
        endDate: '2026-01-01'
      },
      {
        venueId: 15,
        groupId: 15,
        name: 'Newport Jazz Festival',
        description: 'Many great musicians will be performing! Make sure to find Grace Bowers at the center stage.',
        type: 'In person',
        capacity: 9000,
        price: 289,
        startDate: '2025-01-01',
        endDate: '2026-01-01'
      },
      {
        venueId: 16,
        groupId: 16,
        name: 'Lesson One',
        description: 'I can do anything you can do and more. Get ready to get better at bass by watching me. - Jaco Pastorius',
        type: 'In person',
        capacity: 10500,
        price: 12,
        startDate: '2025-01-01',
        endDate: '2026-01-01'
      },
      {
        venueId: 17,
        groupId: 17,
        name: 'Clown with Flea',
        description: 'When Marcus Miller played Jaco\'s part on the song Punk Jazz, Flea knew he needed to make a punk song that Marcus Miller could be proud of. From that dream arose this workshop and performance.',
        type: 'In person',
        capacity: 4000,
        price: 90,
        startDate: '2025-01-01',
        endDate: '2026-01-01'
      },
      {
        venueId: 18,
        groupId: 18,
        name: 'Straigt Outta Harlem',
        description: 'Elle Fitsgerald and Loui Armstrong teach the art of scatting.',
        type: 'In person',
        capacity: 9,
        price: 3012,
        startDate: '2025-01-01',
        endDate: '2026-01-01'
      },
      {
        venueId: 19,
        groupId: 19,
        name: '"No Fenders For Trucks" - The Gibson Talks',
        description: 'Derek Trucks is know for playing a Gibson SG. Why not a fender? Lets talk about it.',
        type: 'Online',
        capacity: 100,
        price: 12,
        startDate: '2025-01-01',
        endDate: '2026-01-01'
      },
      {
        venueId: 20,
        groupId: 2,
        name: 'Creating the Experience',
        description: 'There is an experience that no one has created. What is it?',
        type: 'Online',
        capacity: 2,
        price: 4,
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
      venueId: { [Op.between]: [1, 20] }
    }, {});
  }
};

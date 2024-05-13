'use strict';
const { User } = require('../models');
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
    await User.bulkCreate([
      {
        firstName: 'Jimi',
        lastName: 'Hendrix',
        email: 'Jimi@user.io',
        username: 'LittleWing',
        hashedPassword: bcrypt.hashSync('password'),
      },
      {
        firstName: 'Eric',
        lastName: 'Clapton',
        email: 'slowhand@user.io',
        username: 'SlowHand',
        hashedPassword: bcrypt.hashSync('password2'),
      },
      {
        firstName: 'Robert',
        lastName: 'Plant',
        email: 'Dr.Robert@user.io',
        username: 'LedZep223',
        hashedPassword: bcrypt.hashSync('password3'),
      },
      {
        firstName: 'Grace',
        lastName: 'Bowers',
        email: 'amazingGrace@user.io',
        username: 'AmazingGrace',
        hashedPassword: bcrypt.hashSync('password4'),
      },
      {
        firstName: 'Ele',
        lastName: 'Fitzgerald',
        email: 'ele@user.io',
        username: 'scooBaDAdeEe23',
        hashedPassword: bcrypt.hashSync('password5'),
      },
      {
        firstName: 'Jaco',
        lastName: 'Pastorius',
        email: 'JohnFrancis@user.io',
        username: 'Adbass',
        hashedPassword: bcrypt.hashSync('password6'),
      },
      {
        firstName: 'Flea',
        lastName: 'None',
        email: 'Flea@user.io',
        username: 'TheFlea',
        hashedPassword: bcrypt.hashSync('password7'),
      },
      {
        firstName: 'Derek',
        lastName: 'Trucks',
        email: 'DTrucks12@user.io',
        username: 'SlideOnStrings3',
        hashedPassword: bcrypt.hashSync('password8'),
      },
      {
        firstName: 'Joshua',
        lastName: 'Bell',
        email: 'tripple.stop.king@user.io',
        username: 'JustJoshua',
        hashedPassword: bcrypt.hashSync('password9'),
      },
      {
        firstName: 'Julian',
        lastName: 'Loge',
        email: 'Julian.Loge@user.io',
        username: 'Julian556',
        hashedPassword: bcrypt.hashSync('password10'),
      },
      {
        firstName: 'Bobby',
        lastName: 'Market',
        email: 'Nigerian.Prince3@user.io',
        username: 'Emilio',
        hashedPassword: bcrypt.hashSync('password11'),
      },
      {
        firstName: 'Garrett',
        lastName: 'Weston',
        email: 'CowboyoftheWeston@user.io',
        username: '6stringkid34',
        hashedPassword: bcrypt.hashSync('password12'),
      },
      {
        firstName: 'Brian',
        lastName: 'Bromberg',
        email: 'slaptheupright@user.io',
        username: 'Fretless99',
        hashedPassword: bcrypt.hashSync('password13'),
      },
      {
        firstName: 'Billie',
        lastName: 'Holiday',
        email: 'Ms.Billie.Holiday@user.io',
        username: 'Ms.Billie',
        hashedPassword: bcrypt.hashSync('password14'),
      },
      {
        firstName: 'Tommy',
        lastName: 'Emanuel',
        email: 'tomtom@user.io',
        username: 'guitarist1',
        hashedPassword: bcrypt.hashSync('password15'),
      },
      {
        firstName: 'Paul',
        lastName: 'McCartney',
        email: 'number1Beattle@user.io',
        username: 'Imthewalrus42',
        hashedPassword: bcrypt.hashSync('password16'),
      },
      {
        firstName: 'John',
        lastName: 'Lennon',
        email: 'better.than.paul@user.io',
        username: 'eggman1',
        hashedPassword: bcrypt.hashSync('password17'),
      },
      {
        firstName: 'Elton',
        lastName: 'John',
        email: 'notbillyjoel@user.io',
        username: 'TheRealPianoMan9',
        hashedPassword: bcrypt.hashSync('password18'),
      },
      {
        firstName: 'Brittany',
        lastName: 'Spears',
        email: 'Oops@user.io',
        username: 'toxiclady23',
        hashedPassword: bcrypt.hashSync('password19'),
      },
      {
        firstName: 'Edgar',
        lastName: 'Meyer',
        email: 'notFred@user.io',
        username: 'BassPlayer1',
        hashedPassword: bcrypt.hashSync('password20'),
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
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['LittleWing', 'SlowHand', 'LedZep223', 'AmazingGrace', 'scooBaDAdeEe23', 'Adbass', 'TheFlea', 'SlideOnStrings3', 'JustJoshua', 'Julian556', 'Emilio', '6stringkid34', 'Fretless99', 'Ms.Billie', 'guitarist1', 'Imthewalrus42', 'eggman1', 'TheRealPianoMan9', 'toxiclady23', 'BassPlayer1'] }
    }, {});
  }
};

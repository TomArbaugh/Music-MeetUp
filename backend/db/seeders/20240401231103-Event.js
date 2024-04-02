'use strict';
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
        name: 'EventNameOne',
        description: 'eventOneDescrip',
        type: 'Fun',
        capacity: 100,
        price: 12,
        startDate: '2024-01-01',
        endDate: '2024-01-01'
      },
      {
        venueId: 2,
        groupId: 2,
        name: 'EventNameTwo',
        description: 'eventTWODescrip',
        type: 'Fun',
        capacity: 10,
        price: 90,
        startDate: '2024-01-01',
        endDate: '2024-01-01'
      },
      {
        venueId: 3,
        groupId: 3,
        name: 'EventNameThree',
        description: 'eventtHREEDescrip',
        type: 'Business',
        capacity: 900,
        price: 212,
        startDate: '2024-01-01',
        endDate: '2024-01-01'
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
      venueId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};

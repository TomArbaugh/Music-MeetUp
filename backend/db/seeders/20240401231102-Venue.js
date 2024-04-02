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
    await Venue.bulkCreate([
      {
        groupId: 1,
        address: 'validaddress',
        city: 'Seattle',
        state: 'WA',
        lat: '42',
        lng: '67'
      },
      {
        groupId: 2,
        address: 'validaddress2',
        city: 'LA',
        state: 'CA',
        lat: '23',
        lng: '89'
      },
      {
        groupId: 3,
        address: 'validAddress3',
        city: 'New York',
        state: 'NY',
        lat: '45',
        lng: '56'
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
      groupId: { [Op.in]: [1, 2, 3] }
    }, {});
    
  }
};

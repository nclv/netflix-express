'use strict';

// Get JSON files
var json_rated_path = './data/rated_titles.json';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    const ObjectArray = require('../migrate_from_json')(json_rated_path, false);
    return queryInterface.bulkInsert('Titles', ObjectArray, {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('Titles', { type: false }, {});
  }
};

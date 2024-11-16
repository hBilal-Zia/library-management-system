'use strict';

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
    await queryInterface.bulkInsert('genres', [
      {
        name: 'Science Fiction',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Fantasy',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Mystery',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Thriller',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Non-Fiction',
        created_at: new Date(),
        updated_at: new Date()
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('genres', null, {});
    await queryInterface.sequelize.query(`ALTER SEQUENCE genres_id_seq RESTART WITH 1`);
  }
};

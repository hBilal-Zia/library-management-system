'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.addColumn('books', 'issued_to', {
      type: Sequelize.INTEGER,
      allowNull: true,  // Allow NULL since the book may not be issued
      references: {
        model: 'users',  // Reference the 'Users' table
        key: 'id'        // Reference the 'id' column in 'Users'
      },
      onUpdate: 'CASCADE',  // Update 'issued_to' when the 'User' id changes
      onDelete: 'SET NULL'  // Set 'issued_to' to NULL when the referenced 'User' is deleted
    });

    await queryInterface.addColumn('books', 'is_available', {
      type: Sequelize.BOOLEAN,  // Type for boolean column
      allowNull: false,          // Cannot be NULL
      defaultValue: true         // Default to true (book is available by default)
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('Books', 'issued_to');
    await queryInterface.removeColumn('Books', 'is_available');
  }
};

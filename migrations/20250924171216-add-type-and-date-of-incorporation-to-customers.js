'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('customers', 'type', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('customers', 'date_of_incorporation', {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('customers', 'type');
    await queryInterface.removeColumn('customers', 'date_of_incorporation');
  }
};

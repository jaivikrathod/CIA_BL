'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('insurance_details', 'agent_code', {
      type: Sequelize.STRING(50),
      allowNull: true
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('insurance_details', 'agent_code');
  }
};

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('insurance_details', 'cashback_amount', {
      type: Sequelize.DECIMAL(15, 2),
      allowNull: true,
      defaultValue: 0.00
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('insurance_details', 'cashback_amount');
  }
};
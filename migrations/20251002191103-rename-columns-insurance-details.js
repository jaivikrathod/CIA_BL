'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // rename
    await queryInterface.renameColumn('insurance_details', 'tds', 'net_payout_percent');
    await queryInterface.renameColumn('insurance_details', 'tds_amount', 'net_amount');

    // drop payout_percent
    await queryInterface.removeColumn('insurance_details', 'payment_amount');
  },

  async down(queryInterface, Sequelize) {
    // revert rename
    await queryInterface.renameColumn('insurance_details', 'net_payout_percent', 'tds');
    await queryInterface.renameColumn('insurance_details', 'net_amount', 'tds_amount');

    // add back payout_percent
    await queryInterface.addColumn('insurance_details', 'payment_amount', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
  }
};

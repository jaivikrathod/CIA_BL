'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const fieldsToChange = [
      'amount',
      'net_amount',
      'net_income',
      'payout_percent',
      'net_payout_percent',
      'od_premium',
      'tp_premium',
      'package_premium',
      'gst',
      'premium'
    ];

    for (const field of fieldsToChange) {
      await queryInterface.changeColumn('insurance_details', field, {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const fieldsToChange = [
      'amount',
      'net_amount',
      'net_income',
      'payout_percent',
      'net_payout_percent',
      'od_premium',
      'tp_premium',
      'package_premium',
      'gst',
      'premium'
    ];

    for (const field of fieldsToChange) {
      await queryInterface.changeColumn('insurance_details', field, {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
  },
};

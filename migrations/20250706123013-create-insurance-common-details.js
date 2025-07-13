'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('insurance_common_details', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      customer_id: {
        type: Sequelize.INTEGER
      },
      segment: {
        type: Sequelize.STRING
      },
      vehicle_number: {
        type: Sequelize.STRING
      },
      insurance_type: {
        type: Sequelize.STRING
      },
      segment_vehicle_type: {
        type: Sequelize.STRING
      },
      segment_vehicle_detail_type: {
        type: Sequelize.STRING
      },
      model: {
        type: Sequelize.STRING
      },
      manufacturer: {
        type: Sequelize.STRING
      },
      fuel_type: {
        type: Sequelize.STRING
      },
      yom: {
        type: Sequelize.INTEGER
      },
      is_active: {
        type: Sequelize.TINYINT
      },
      status: {
        type: Sequelize.TINYINT
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('insurance_common_details');
  }
};
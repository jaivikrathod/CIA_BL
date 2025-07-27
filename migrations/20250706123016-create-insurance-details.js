'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('insurance_details', {
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
      insurance_id: {
        type: Sequelize.INTEGER
      },
      common_id: {
        type: Sequelize.STRING
      },
      insurance_date: {
        type: Sequelize.DATE
      },
      documents: {
        type: Sequelize.STRING,
        allowNull: true
      },
      business_type: {
        type: Sequelize.STRING
      },
      idv: {
        type: Sequelize.STRING
      },
      currentncb: {
        type: Sequelize.STRING
      },
      insurance_company: {
        type: Sequelize.STRING
      },
      policy_no: {
        type: Sequelize.STRING
      },
      od_premium: {
        type: Sequelize.INTEGER
      },
      tp_premium: {
        type: Sequelize.INTEGER
      },
      package_premium: {
        type: Sequelize.INTEGER
      },
      gst: {
        type: Sequelize.INTEGER
      },
      premium: {
        type: Sequelize.INTEGER
      },
      collection_date: {
        type: Sequelize.DATE
      },
      case_type: {
        type: Sequelize.STRING
      },
      payment_mode: {
        type: Sequelize.INTEGER
      },
      policy_start_date: {
        type: Sequelize.DATE
      },
      policy_expiry_date: {
        type: Sequelize.DATE
      },
      agent_id: {
        type: Sequelize.STRING
      },
      payout_percent: {
        type: Sequelize.INTEGER
      },
      amount: {
        type: Sequelize.INTEGER
      },
      tds: {
        type: Sequelize.INTEGER
      },
      tds_amount: {
        type: Sequelize.INTEGER
      },
      payment_amount: {
        type: Sequelize.INTEGER
      },
      difference: {
        type: Sequelize.INTEGER
      },
      net_income: {
        type: Sequelize.INTEGER
      },
      payment_received: {
        type: Sequelize.TINYINT
      },
      insurance_count: {
        type: Sequelize.INTEGER
      },
      step: {
        type: Sequelize.INTEGER
      },
      is_active: {
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
    await queryInterface.dropTable('insurance_details');
  }
};
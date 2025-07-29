'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('insurance_company', [
      {
        id: 1,
        name: 'Care Health Insurance',
        extras: 'Leading health insurance provider',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        name: 'Star Health',
        extras: 'Specializes in family health plans',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 3,
        name: 'HDFC ERGO',
        extras: null,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('insurance_company', null, {});
  }
}; 
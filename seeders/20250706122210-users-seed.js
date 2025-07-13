'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [
      {
        id: 8,
        type: 'Admin',
        full_name: 'jaivik',
        mobile: '9173164696',
        email: 'jaivikrathod7@gmail.com',
        password: '$2a$10$b07oxgMrUv8UxqEWs9rW/eKnr6rRFDkjMqBlHLbP3DR3su0ChBGP.',
        is_active: 1,
        created_at: '2025-05-17 23:26:38',
        updated_at: '2025-07-05 17:23:57'
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};

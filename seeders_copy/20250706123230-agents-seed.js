'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('agents', [
      {
        id: 2,
        user_id: 8,
        full_name: 'Jaivik',
        email: 'jaivikrathod7@gmail.com',
        primary_mobile: '9191919919',
        is_active: 1,
        created_at: '2025-05-08 23:08:39',
        updated_at: '2025-05-18 14:11:27'
      },
      {
        id: 3,
        user_id: 9,
        full_name: 'Shivangi',
        email: 'shivangi7@gmail.com',
        primary_mobile: '9181818181',
        is_active: 0,
        created_at: '2025-05-08 23:08:39',
        updated_at: '2025-05-18 16:23:56'
      },
      {
        id: 6,
        user_id: 9,
        full_name: 'sdsd',
        email: 'oso@sjk.com',
        primary_mobile: '0202929292',
        is_active: 1,
        created_at: '2025-05-16 00:40:12',
        updated_at: '2025-05-18 14:24:19'
      },
      {
        id: 7,
        user_id: 8,
        full_name: 'nxnxn',
        email: 'jj@jj.com',
        primary_mobile: '9393993939',
        is_active: 1,
        created_at: '2025-05-16 00:40:23',
        updated_at: '2025-05-18 14:11:27'
      },
      {
        id: 8,
        user_id: 8,
        full_name: 'kkpl',
        email: 'ko@ko.com',
        primary_mobile: '2222222222',
        is_active: 0,
        created_at: '2025-05-16 00:42:57',
        updated_at: '2025-05-18 16:24:44'
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('agents', null, {});
  }
};

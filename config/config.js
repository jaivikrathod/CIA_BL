require('dotenv').config(); // Load .env

module.exports = {
  // development: {
  //   username: process.env.DB_USER,
  //   password: process.env.DB_PASSWORD,
  //   database: process.env.DB_NAME,
  //   host: process.env.DB_HOST,
  //   dialect: 'mysql',
  //   port: '3306'
  // },
  development: {
    username: 'jaivikrathod',
    password: '9844@Mysql',
    database: 'care_insurance',
    host: 'localhost',
    dialect: 'mysql',
    port: '3306'
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql'
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql'
  }
};

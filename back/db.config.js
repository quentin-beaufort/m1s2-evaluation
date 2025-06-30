const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

// Charge les bonnes variables d'environnement
dotenv.config({
  path: process.env.NODE_ENV === 'test' ? './.env.test' : './.env'
});

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PWD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false
  }
);

module.exports = sequelize;

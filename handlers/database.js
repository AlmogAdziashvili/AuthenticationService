const Sequelize = require('sequelize');
const logger = require('./logger');
const { promiseHandler } = require('./utils');
const {
  database, userName, password, host,
} = require('../.config').mySqlCredentials;

// Establish the connection with the MySQL Server
const sequelize = new Sequelize(database, userName, password, {
  host,
  dialect: 'mysql',
  logging: false,
});

// Test the connection and log
promiseHandler(
  sequelize.authenticate(),
  () => logger.info('Connection with the DB has been established successfully.'),
  (err) => logger.error('Unable to connect to the database:', err),
);

module.exports = sequelize;

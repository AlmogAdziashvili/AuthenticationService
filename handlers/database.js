const Sequelize = require('sequelize');
const logger = require('./logger');
const {
  database, userName, password, host,
} = require('../.config').mySqlCredentials;

// Establish the connection with the MySQL Server
const sequelize = new Sequelize(
  `${database}${process.env.NODE_ENV === 'test' ? 'test' : ''}`,
  userName,
  password,
  {
    host,
    dialect: 'mysql',
    logging: false,
  });

// Test the connection and log
sequelize.authenticate().then(
  () => logger.info('Connection with the DB has been established successfully.'),
).catch(
  (err) => logger.error('Unable to connect to the database:', err),
);

module.exports = sequelize;

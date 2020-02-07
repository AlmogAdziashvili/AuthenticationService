const Sequelize = require('sequelize');
const logger = require('./logger');

const {
  database, userName, password, host,
} = require('../.config').mySqlCredentials;

const sequelize = new Sequelize(database, userName, password, {
  host,
  dialect: 'mysql',
});

sequelize.authenticate().then(() => {
  logger.info('Connection has been established successfully.');
}).catch((err) => {
  logger.info('Unable to connect to the database:', err);
});

module.exports = sequelize;

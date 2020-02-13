const { STRING } = require('sequelize');
const sequelize = require('../handlers/database');

const Premission = sequelize.define('user', {
  title: { type: STRING, allowNull: false, validate: { isAlpha: true } },
  description: { type: STRING, allowNull: false, validate: { isAlpha: true } },
});

Premission.sync();

module.exports = Premission;

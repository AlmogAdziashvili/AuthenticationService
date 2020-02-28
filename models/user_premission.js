const { INTEGER } = require('sequelize');
const sequelize = require('../handlers/database');

const UserPremission = sequelize.define('user_premission', {
  user_id: { type: INTEGER, allowNull: false },
  premission_id: { type: INTEGER, allowNull: false },
});

UserPremission.sync();

module.exports = UserPremission;

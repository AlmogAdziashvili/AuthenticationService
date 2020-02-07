const { STRING, BOOLEAN, DATE } = require('sequelize');
const sequelize = require('../handlers/database');

const User = sequelize.define('user', {
  email: { type: STRING, allowNull: false, validate: { isEmail: true } },
  firstName: { type: STRING, allowNull: false, validate: { isAlpha: true } },
  lastName: { type: STRING, allowNull: false, validate: { isAlpha: true } },
  password: { type: STRING },
  googleAccount: { type: BOOLEAN },
  resetPasswordToken: { type: STRING },
  resetPasswordExpires: { type: DATE },
});

User.sync({ force: true });

module.exports = User;

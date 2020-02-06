const { define, STRING, DATE } = require('sequelize');

const User = define('user', {
  email: { type: STRING, allowNull: false, validate: { isEmail: true } },
  firstName: { type: STRING, allowNull: false, validate: { isAlpha: true } },
  lastName: { type: STRING, allowNull: false, validate: { isAlpha: true } },
  password: { type: STRING, allowNull: false },
  resetPasswordToken: { type: STRING },
  resetPasswordExpires: { type: DATE },
});

User.sync({ force: true });

module.exports = User;

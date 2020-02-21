const { createTransport } = require('nodemailer');
const { emailCredentials } = require('../.config');

const resetMailOptions = (email, resetPage, token) => ({
  to: email,
  from: 'moshememes@support.com',
  subject: 'Password Reset for MosheMemes',
  text:
    `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
    Please click on the following link, or paste this into your browser to complete the process:\n\n
    http://${resetPage}${token}\n\n
    If you did not request this, please ignore this email and your password will remain unchanged.\n`,
});

const smtpTransport = createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: emailCredentials,
  tls: {
    rejectUnauthorized: false,
  },
});

module.exports = {
  sendResetMail:
    (email, resetPage, token) => smtpTransport.sendMail(resetMailOptions(email, resetPage, token)),
};

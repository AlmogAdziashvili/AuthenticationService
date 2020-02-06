const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const passport = require('passport');
const Sequelize = require('sequelize');
require('./handlers/passport_google_config')(passport);

const logger = require('./handlers/logger');
const { statusCodes, generateError } = require('./handlers/utils');

const authRouter = require('./routes/auth_route');

const app = express();

const sequelize = new Sequelize('authentication', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
});

sequelize.authenticate().then(() => {
  logger.info('Connection has been established successfully.');
}).catch((err) => {
  logger.info('Unable to connect to the database:', err);
});

app.use(morgan('combined', { stream: logger.stream }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({ origin: true }));
app.use(helmet());
app.use(passport.initialize());

// Routes
app.use('/api', authRouter);

// 404
app.use((req, res) => generateError(req, res, statusCodes.notFound, 'This path is not on the API'));

module.exports = app;

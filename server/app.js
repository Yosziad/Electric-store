require('dotenv').config({path:"./.env"});
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const session = require('express-session');
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/order');
const userRoutes = require('./routes/user');
const Logger = require('./services/logger_services');
const path = require('path');

const logger = new Logger('app');

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(session({
  secret: process.env.JWT_KEY,
  resave: false,
  saveUninitialized: true,
}));

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useCreateIndex', true);

if(process.env.ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/build'));
  })
}


app.use('/product', productRoutes);
app.use('/order', orderRoutes);
app.use('/user', userRoutes);

app.use((_req, res) => {
  const error = new Error('not found');
  error.status = 404;
  res.status(error.status).send();
  logger.error('not found');
});

app.listen(process.env.PORT || 8080, () => {
  logger.info(`APP LAUNCHED IN PORT${process.env.PORT || 8080}`);
});

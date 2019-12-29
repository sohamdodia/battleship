// Module dependencies

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const config = require('./config');
const helper = require('./helper');


const models = helper.getGlobbedPaths(config.const.dbModels);
models.forEach((modelPath) => {
  require(path.resolve(modelPath));
});

// MongoDB Initialization
mongoose.connect(config.const.dbUri, { useNewUrlParser: true, useUnifiedTopology: true }, ((err) => {
  if (err) {
    console.log('Could not connect to MongoDB', err);
  } else {
    mongoose.set('debug', false);
  }
}));

// ExpressJS Initialization
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

const routes = helper.getGlobbedPaths(config.const.serverRoutes);
routes.forEach((routePath) => {
  require(path.resolve(routePath))(app);
});

// NodeJS Server Initialization
app.listen(config.const.apiPort, () => {
  console.log(`App is running on port ${config.const.apiPort}`);
});

module.exports = { app };
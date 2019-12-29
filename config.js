require('dotenv').config();

exports.const = {
  apiPort: process.env.API_PORT || 6005,
  dbUri: process.env.DB_URI ||  process.env.NODE_ENV === 'test' ? 'mongodb://localhost:27017/taskworld-test' : 'mongodb://localhost:27017/taskworld',
  serverRoutes: 'modules/*/routes/*.js',
  dbModels: 'modules/*/models/*.js'
};
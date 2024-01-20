const { config } = require('./../../config');

module.exports = {
  development: {
    username: config.database.user,
    password: config.database.password,
    database: config.database[config.app.env],
    host: config.database.host,
    dialect: 'mysql',
  },
  test: {
    username: config.database.user,
    password: config.database.password,
    database: config.database[config.app.env],
    host: config.database.host,
    dialect: 'mysql',
  },
  production: {
    username: config.database.user,
    password: config.database.password,
    database: config.database[config.app.env],
    host: config.database.host,
    dialect: 'mysql',
  },
};

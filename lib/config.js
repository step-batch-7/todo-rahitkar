const { env } = require('process');

const config = {
  DATA_STORE: `${__dirname}/../${env.DATA_STORE}`
};

module.exports = config;

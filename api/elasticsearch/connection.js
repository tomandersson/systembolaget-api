const elastic = require('elasticsearch');
const env = require('../env');

const client = new elastic.Client({
  hosts: env.elastic.hosts
});

module.exports = client;
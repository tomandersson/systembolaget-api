const elasticClient = require('./connection');
const env = require('../env');

function index(data, type) {
  let body = data
      .map((item) => [{ index:  { _index: env.elastic.indexName, _type: type, _id: item.id } }, item])
      .reduce((a, b) => a.concat(b));

  return elasticClient.bulk({ body: body });
}

module.exports = {
  index: index
};
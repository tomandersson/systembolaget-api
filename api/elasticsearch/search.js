const elasticClient = require('./connection');
const env = require('../env');

function _performSearch(query) {
  const config = {
    index: env.elastic.indexName
  };

  if (typeof query === 'string') {
    config.q = query;
  } else {
    config.body = query;
  }

  return elasticClient.search(config)
      .then((response) => {

        const hits = response.hits.hits.map((hit) => hit._source);
        return Promise.resolve({
          count: response.hits.total,
          items: hits
        })
      });
}

module.exports = {
  performSearch: _performSearch
};
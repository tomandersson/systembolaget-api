const express = require('express');
const router = express.Router();
const elasticClient = require('../elasticsearch/connection');
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

function findById(req, res, next) {
  let id = req.params.itemId;

  _performSearch('id:' + id)
    .then((data) => res.json(data))
    .catch((err) => {
      const error = new Error('Error looking for ' + id + ': ' + err);
      error.status = 404;
      next(error);
    });
}

function search(req, res, next) {
  let query = req.query.q;

  _performSearch({
    'from' : 0,
    'size' : 10000,
    'query': {
      'match': {
        '_all': query
      }
    }
  }).then((data) => res.json(data))
    .catch((err) => {
      const error = new Error('Error looking for ' + query + ': ' + err);
      error.status = 404;
      next(error);
    });
}

router.get('/search', search);
router.get('/:itemId', findById);

module.exports = router;

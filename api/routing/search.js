const express = require('express');
const router = express.Router();
const elasticClient = require('../elasticsearch/connection');
const env = require('../env');

function search(req, res, next) {
  let id = req.params.itemId;

  elasticClient.search(
    {
      index: env.elastic.indexName,
      q: 'itemId:' + id
    })
    .then((response) => res.json(response.hits.hits))
    .catch((err) => {
      const error = new Error('Error looking for ' + id + ': ' + error);
      error.status = 404;
      next(error);
    });
}

router.get('/:itemId', search);

module.exports = router;

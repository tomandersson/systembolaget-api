const performSearch = require('../elasticsearch/search').performSearch;

function findById(req, res, next) {
  let id = req.params.itemId;

  performSearch('id:' + id)
      .then((data) => res.json(data))
      .catch((err) => {
        const error = new Error('Error looking for ' + id + ': ' + err);
        error.status = 404;
        next(error);
      });
}

function search(req, res, next) {
  let query = req.query.q;

  performSearch({
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

module.exports = {
  search: search,
  findById: findById
};
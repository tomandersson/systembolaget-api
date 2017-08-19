const performSearch = require('../elasticsearch/search').performSearch;
const filterBuilder = require('../util/filterBuilder');

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
      bool: {
        must: {
          prefix: {
            '_all': query
          }
        },
        filter: filterBuilder.getFilters(req)
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
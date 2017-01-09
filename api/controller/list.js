const performSearch = require('../elasticsearch/search').performSearch;

const PARAMETERS = {
  country: 'country',
  producer: 'producer',
  supplier: 'supplier'
};

function _getCountryQuery(params) {
  let must = [
      {
        match_phrase: {
          country: params.country
        }
      }];

    if (params.region) {
      must.push({
        match_phrase: {
          region: params.region
        }
      });
    }

  return {
    bool: {
      must: must
    }
  };
}

function listBy(parameter, req, res, next) {
  let query = {};
  switch (parameter) {
    case PARAMETERS.country:
      query = _getCountryQuery(req.params);
      break;
    case PARAMETERS.supplier:
      query = {
        match_phrase: {
          supplier: req.params.supplier
        }
      };
      break;
    case PARAMETERS.producer:
      query = {
        match_phrase: {
          producer: req.params.producer
        }
      };
      break;
  }
  performSearch({
    'from' : 0,
    'size' : 10000,
    'query': query
  })
      .then((data) => res.json(data))
      .catch((err) => {
        const error = new Error('Error looking for ' + JSON.stringify(query) + ': ' + err);
        error.status = 404;
        next(error);
      });
}

module.exports = {
  listBy: listBy,
  PARAMETERS: PARAMETERS
};
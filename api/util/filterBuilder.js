// TODO: add mapping for group

/*
build search filter from http query.
filters:
 * vintage
 * country
 * region
 * supplier
 * line
 * available from
 * producer
 * group
 * contents?
 */
const availableFilters = {
  'vintage': numericMaybeRangeFilter,
  'country': termsFilter,
  'region': termsFilter,
  'supplier': termsFilter,
  'line': termsFilter,
  'availableFrom': dateFilter,
  'producer': termsFilter,
  'group': wineGroupFilter
};

const availableFilterNames = Object.keys(availableFilters);
const numberRangeRegex = /^(\d+)-(\d+)$/;
const groups = {
  red: ['rött vin', 'röda'],
  rose: ['rosé', 'rosévin'],
  sparkling: ['mousserande vin'],
  white: ['vitt vin', 'vita']
};

function termsFilter(fieldName, terms) {
  if (!Array.isArray(terms)) {
    terms = [terms];
  }

  let filter = {
    terms: {}
  };

  filter.terms[fieldName] = terms;
  return filter;
}

function numericMaybeRangeFilter(fieldName, years) {
  let rangeMatch = numberRangeRegex.exec(years);
  if (!Array.isArray(years) && rangeMatch) {
    let filter = {
      range : {}
    };

    filter.range[fieldName] = {
      gte: rangeMatch[1],
      lte: rangeMatch[2]
    };
    return filter;
  } else {
    return termsFilter(fieldName, years);
  }
}

function dateFilter(fieldName, dateString) {
  let filter = {
    range : {}
  };

  filter.range[fieldName] = {
    gte: dateString
  };
  return filter;
}

function wineGroupFilter(fieldName, groupName) {
  let groupTerms = groups[groupName] || [];
  let filter = {
    bool: {
      should: []
    }
  };

  groupTerms.map((term) => {
        let obj = {
          match_phrase: {}
        };
        obj.match_phrase[fieldName] = term;
        return obj;
      })
      .map((match) => filter.bool.should.push(match));

  return filter;
}

function _getFilters(req) {
  let filters = [];
  Object.keys(req.query)
      .filter((key) => availableFilterNames.indexOf(key) !== -1)
      .forEach((key) => {
        let func = availableFilters[key];
        let arg = req.query[key];

        filters.push(func(key, arg));
      });

  return filters;
}

module.exports = {
  getFilters: _getFilters
};
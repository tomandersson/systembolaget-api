const Debug = require('debug');

const environments = {
  prod: {
    elastic: {
      hosts: ['http://localhost:9200']
    }
  },
  stage: {
    elastic: {
      hosts: ['http://localhost:9200']
    }
  },
  local: {
    elastic: {
      hosts: ['http://localhost:9200']
    }
  }
};

module.exports = (function() {
  let environmentString = (process.env.ENV || "local").toLowerCase();
  let environment = environments[environmentString];

  if (!environment) {
    throw new Error(environmentString + " is not recognized as a valid environment");
  }

  let elastic = environment.elastic;

  elastic.indexName = 'products';
  elastic.documentTypes = {
    wine: 'wine'
  };

  return {
    name: environmentString,
    elastic: environment.elastic,
    apiEndpoints: {
      product: 'https://www.systembolaget.se/api/assortment/products/xml'
    },
    port: process.env.PORT || 3000,
    modelUpdateInterval: 3600000,
    logConfig: {
      namespace: 'systembolaget-api'
    }
  };
})();

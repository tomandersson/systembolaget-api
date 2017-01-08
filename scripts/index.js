const elasticConnection = require('./../api/elasticsearch/connection');
const env = require('../api/env');

if (process.argv.filter((arg) => arg.match(/\bcreate\b/)).length) {
  elasticConnection.indices.create({
    index: env.elastic.indexName,
    body: {

      settings: {
        analysis: {
          filter: {
            "autocomplete_filter": {
              type:     "edge_ngram",
              "min_gram": 1,
              "max_gram": 20
            }
          },
          analyzer: {
            autocomplete: {
              type:      "custom",
              tokenizer: "standard",
              filter: [
                "lowercase",
                "autocomplete_filter"
              ]
            }
          }
        }
      }
    }
  })
      .then((response) => {
        console.log('Created index, ' + env.elastic.indexName);
        return elasticConnection.indices.putMapping({
          index: env.elastic.indexName,
          type: env.elastic.documentTypes.wine,
          body: {
            properties: {
              name: {
                type: 'string',
                analyzer:  "autocomplete",
                "search_analyzer": "standard"
              },
              type: {
                type: 'string',
                analyzer:  "autocomplete",
                "search_analyzer": "standard"
              },
              producer: {
                type: 'string',
                analyzer:  "autocomplete",
                "search_analyzer": "standard"
              },
              volume: {
                type: 'integer',
                index: 'not_analyzed'
              },
              price: {
                type: 'integer',
                index: 'not_analyzed'
              },
              line: {
                type: 'keyword'
              }
            }
          }
        })
      })
      .then((response) => console.log('Created mappings for ' + env.elastic.documentTypes.wine))
      .catch((err) => console.error('Error when creating index: ' + err));
} else if (process.argv.filter((arg) => arg.match(/\bdelete\b/)).length) {
  elasticConnection.indices.delete({ index: env.elastic.indexName })
      .then((response) => console.log('Deleted index ' + env.elastic.indexName))
      .catch((err) => console.error('Unable to delete index: ' + err));
}

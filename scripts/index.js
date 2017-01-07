const elasticConnection = require('./../api/elasticsearch/connection');
const env = require('../api/env');

if (process.argv.filter((arg) => arg.match(/\bcreate\b/)).length) {
  elasticConnection.indices.create({ index: env.elastic.indexName })
      .then((response) => console.log('Created index, ' + env.elastic.indexName))
      .catch((err) => console.error('Unable to create index: ' + err));
} else if (process.argv.filter((arg) => arg.match(/\bdelete\b/)).length) {
  elasticConnection.indices.delete({ index: env.elastic.indexName })
      .then((response) => console.log('Deleted index ' + env.elastic.indexName))
      .catch((err) => console.error('Unable to delete index: ' + err));
}

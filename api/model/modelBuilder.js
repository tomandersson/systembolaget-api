const moment = require('moment-timezone');
const env = require('../env');
const debug = require('debug')('modelBuilder');

const WINE_TYPES = [
    'röda',
    'rött vin',
    'vitt vin',
    'vin av flera typer',
    'vita',
    'mousserande vin',
    'rose',
    'rosévin'
];
const BEER_TYPE = 'öl';

function buildWine(product) {
  let wine = {
    itemId: Number(product.nr),
    articleId: Number(product.Artikelid),
    name: product.Namn,
    type: product.Namn2,
    producer: product.Producent,
    country: product.Ursprungslandnamn,
    region: product.Ursprung,
    vintage: Number(product.Argang),
    supplier: product.Leverantor,
    line: product.Sortiment,
    availableFrom: product.Saljstart,
    price: Number(product.Prisinklmoms),
    volume: Number(product.Volymiml),
    packaging: product.Forpackning
  };

  if (wine.type == '' || wine.type === wine.producer) {
    wine.type = undefined;
  }

  return wine;
}

function buildWines(products) {
  debug('Building wines');

  let wine = products.filter((product) => WINE_TYPES.indexOf(product.Varugrupp.toLowerCase()) !== -1);
  debug('Found ' + wine.length + ' wines');

  return wine.map(buildWine);
}

function _buildFromWines(wines, key) {
  debug('Building ' + key + 's');
  let items = {};

  wines.forEach((wine) => {
    if (wine[key] && !items[wine[key]]) {
      items[wine[key]] = 1;
    }
  });

  return Object.keys(items);
}

function buildProducers(wines) {
  return _buildFromWines(wines, 'producer');
}

function buildSuppliers(wines) {
  return _buildFromWines(wines, 'supplier');
}

function buildSync(object) {
  const wines = buildWines(object.artikel);
  return {
    suppliers: buildSuppliers(wines),
    producers: buildProducers(wines),
    wines: wines
  }
}

function buildModel(products) {
  return new Promise((resolve, reject) => {
    debug("Building model");
    resolve(buildSync(products));
  })
}

module.exports = {
  build: buildModel,
  buildSync: buildSync
};

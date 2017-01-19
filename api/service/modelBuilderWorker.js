const request = require('request');
const env = require('../env');
const modelBuilder = require('../model/modelBuilder');
const debug = require('../util/debugWrapper')('modelBuilderWorker');
const xml2js = require('xml2js');
const net = require('net');

const API_URL = env.apiEndpoints.product;
let standaloneMode = process.argv.filter((arg) => arg.match(/standalone/)).length;
let writePipe = new net.Socket({ fd: 4 });

function getRepo() {
  return new Promise((resolve, reject) => {
    const requestSettings = {
      method: 'GET',
      url: API_URL,
      encoding: null
    };

    request(requestSettings, function (error, response, body) {
      if (error) {
        reject(error);
        return;
      }

      resolve(body);
    });
  });
}

function parse(xmlAsString) {
  return new Promise((resolve, reject) => {
    xml2js.parseString(xmlAsString, {explicitArray: false}, (err, result) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(result.artiklar);
    })
  });
}

function handleResult(model) {
  if (standaloneMode) {
    debug('Found ' + model.wines.length + ' wines');
    debug('Found ' + model.producers.length + ' producers');
    debug('Found ' + model.suppliers.length + ' suppliers');
    exit();
  } else {
    debug('Model built, sending to parent');
    return new Promise((resolve, reject) => {
      try {
        writePipe.end(new Buffer(JSON.stringify(model)));
        resolve();
      } catch (e) {
        reject(e)
      }
    })
  }
}

function exit() {
  debug('Worker process exiting');
  process.exit(0);
}

function start() {
  debug('Starting fetch and build of new model');
  getRepo()
      .then(parse)
      .then(modelBuilder.build)
      .then(handleResult)
      .catch((err) => {
        debug.error('Failed to fetch/build new model: ' + err.message, err);
        exit();
      });
}

process.on('message', (message) => {
  debug('Received ' + message + ' from parent process');
  if (message === 'start') {
    start();
  }
});

process.on('SIGTERM', () => exit());

debug('modelBuilderWorker initialized');

if (standaloneMode) {
  debug('Running in standalone mode');
  start();
}
const env = require('../env');
const debug = require('debug')('modelService');
const spawn = require('child_process').spawn;
const elasticIndexer = require('../elasticsearch/index');

const MODEL_UPDATE_INTERVAL = env.modelUpdateInterval || 60000;

let cachedModel;

function scheduleUpdate() {
  return new Promise((resolve, reject) => {
      setTimeout(updateCachedModel, MODEL_UPDATE_INTERVAL);
      resolve();
    });
}

function handleError(err) {
  debug.error('Failed to update cached model (will retry): ' + err.message, err);
  return scheduleUpdate();
}

function notifyModelBuilder() {

  // Reset execArgv to avoid clashing debug-ports
  const oldArgv = process.execArgv;
  process.execArgv = [];
  // Set up communications channels
  const options = { stdio: [0, 1, 2, 'ipc', 'pipe'] };
  const args = [__dirname + '/modelBuilderWorker'];

  // Spawn new process for handling with updating the model
  const modelBuilderWorker = spawn(process.execPath, args, options);
  // Restore execArgv
  process.execArgv = oldArgv;

  // Read from special channel
  const modelChannel = modelBuilderWorker.stdio[4];

  return new Promise((resolve, reject) => {

    modelBuilderWorker.send('start');

    let data = [];
    modelChannel.on('data', (chunk) => { data.push(chunk)});
    modelChannel.on('end', () => {
      let model = Buffer.concat(data);
      debug('Updating cached model');
      cachedModel = JSON.parse(model);

      modelBuilderWorker.kill();
      resolve(cachedModel);
    });
  });
}

function index(data) {
  return elasticIndexer.index(data.wines, env.elastic.documentTypes.wine)
}

function updateCachedModel() {
  return notifyModelBuilder()
      .then(index)
      .then(scheduleUpdate)
      .catch(handleError)
}

module.exports = {
  start: updateCachedModel,
  getModel: () => cachedModel
};

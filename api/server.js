const express = require('express');
const debug = require('./util/debugWrapper')('server');
const path = require('path');
const process = require('process');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const env = require('./env');
const http = require('http');
const modelService = require('./service/modelService');
const searchRoute = require('./routing/search');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// ROUTES
app.get('/health', (req, res) => res.send("app is upp"));
app.use('/api/', searchRoute);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  let errStatus = err.status || 500;
  let errView = errStatus === 404 ? '404' : '500';
  res.status(errStatus);
  debug(err.message);
  res.set('Content-Type', 'text/xml');
  res.render('errors/' + errView);
});


const port = env.port;
app.set('port', port);

const server = http.createServer(app);

server.on('error', function (error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
});

server.on('listening', function () {
  let addr = server.address();
  const bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
  debug('Listening on ' + bind);
});

modelService.start()
    .then((status) => {
      server.listen(port);
    });

module.exports = app;

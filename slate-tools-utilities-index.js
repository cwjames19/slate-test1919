// Copy to ./node_modules/@shopify/slate-tools/utilities, delete index.js, 
// and rename this to index.js.
// Copy to server.crt and server.key to the same directory

// Copy to ./node_modules/@shopify/slate-tools/utilities, delete index.js, 
// and rename this to index.js.
// Copy to server.crt and server.key to the same directory

const path = require('path');
const {promisify} = require('util');
const {existsSync, readFileSync} = require('fs');
const portscanner = require('portscanner');
const SlateConfig = require('@shopify/slate-config');

const config = new SlateConfig(require('../../slate-tools.schema'));

const findAPortInUse = promisify(portscanner.findAPortInUse);

function isHotUpdateFile(key) {
  return /\.hot-update\.json$/.test(key) || /\.hot-update\.js$/.test(key);
}

function sslKeyCert() {
  const key = readFileSync(getSSLKeyPath());
  const cert = readFileSync(getSSLCertPath());

  return {key, cert};
}

function getSSLKeyPath() {
  if (process.env.NODE_ENV = 'development') {
    return path.join(__dirname, './server.key');
  } else if (existsSync(config.get('ssl.key'))) {
    config.get('ssl.key');
  } else {
    path.join(__dirname, './server.pem');
  }
}

function getSSLCertPath() {
  if (process.env.NODE_ENV = 'development') {
    return path.join(__dirname, './server.crt');
  } else if (existsSync(config.get('ssl.cert'))) {
    config.get('ssl.cert');
  } else {
    path.join(__dirname, './server.pem');
  }
}

// Finds a series of available ports of length quantity, starting at a given
// port number and incrementing up. Returns an array of port numbers.
function getAvailablePortSeries(start, quantity, increment = 1) {
  const startPort = start;
  const endPort = start + (quantity - 1);

  return findAPortInUse(startPort, endPort, '127.0.0.1').then((port) => {
    if (typeof port === 'number') {
      return getAvailablePortSeries(port + increment, quantity);
    }

    const ports = [];

    for (let i = startPort; i <= endPort; i += increment) {
      ports.push(i);
    }

    return ports;
  });
}

module.exports = {
  sslKeyCert,
  getSSLKeyPath,
  getSSLCertPath,
  getAvailablePortSeries,
  isHotUpdateFile,
};


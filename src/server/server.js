/* eslint-env node */

import http from 'http';
import fs from 'fs';
import path from 'path';
import factoryRoute from './router';

function serveFile(res, fileName, contentType) {
  // Generic function that sends files from the 'client'
  // directory as HTTP responses.
  const filePath = path.join(__dirname, '../client', fileName);
  const file = fs.readFileSync(filePath);
  res.writeHead(200, { 'Content-Type': contentType });
  res.end(file);
}

function error(req, res) {
  res.writeHead(404, { 'Content-Type': 'text/html' });
  res.end('404');
}

function index(req, res) {
  serveFile(res, 'index.html', 'text/html');
}

function main(req, res) {
  serveFile(res, 'main.js', 'text/javascript');
}

function styles(req, res) {
  serveFile(res, 'main.css', 'text/css');
}

function font(req, res) {
  serveFile(res, 'edmondsans.otf', 'application/font-sfnt');
}

const errorRoute = factoryRoute(/^.*$/, error);
const fontRoute = factoryRoute(/^\/edmondsans\.otf$/, font, errorRoute);
const stylesRoute = factoryRoute(/^\/main\.css$/, styles, fontRoute);
const mainRoute = factoryRoute(/^\/main\.js$/, main, stylesRoute);
const indexRoute = factoryRoute(/^\/$/, index, mainRoute);

// For Heroku--if the app is deployed there,
// pull the port & host from the environment
const port = process.env.PORT || 3000;
const hostName = process.env.HOST || '127.0.0.1';

http.createServer((req, res) => {
  indexRoute.process(req, res);
}).listen(port, hostName);

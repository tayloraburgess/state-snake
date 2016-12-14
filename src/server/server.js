/* eslint-env node */

import http from 'http';
import fs from 'fs';
import path from 'path';
import factoryRoute from './router';

function error(req, res) {
  res.writeHead(404, { 'Content-Type': 'text/html' });
  res.end('404');
}

function index(req, res) {
  const file = path.join(__dirname, '../client', 'index.html');
  const indexFile = fs.readFileSync(file);
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(indexFile);
}

function main(req, res) {
  const file = path.join(__dirname, '../client', 'main.js');
  const mainFile = fs.readFileSync(file);
  res.writeHead(200, { 'Content-Type': 'text/javascript' });
  res.end(mainFile);
}

function styles(req, res) {
  const file = path.join(__dirname, '../client', 'main.css');
  const mainFile = fs.readFileSync(file);
  res.writeHead(200, { 'Content-Type': 'text/css' });
  res.end(mainFile);
}

function font(req, res) {
  const file = path.join(__dirname, '../client', 'edmondsans.otf');
  const mainFile = fs.readFileSync(file);
  res.writeHead(200, { 'Content-Type': 'application/font-sfnt' });
  res.end(mainFile);
}

const errorRoute = factoryRoute(/^.*$/, error);
const fontRoute = factoryRoute(/^\/edmondsans\.otf$/, font, errorRoute);
const stylesRoute = factoryRoute(/^\/main\.css$/, styles, fontRoute);
const mainRoute = factoryRoute(/^\/main\.js$/, main, stylesRoute);
const indexRoute = factoryRoute(/^\/$/, index, mainRoute);

http.createServer((req, res) => {
  indexRoute.process(req, res);
}).listen(3000, '127.0.0.1');

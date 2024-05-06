const express = require('express');
const bodyParser = require('body-parser');

const routes = require('./routers/index');

const APIBASE = 'api/v1';
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

app.use(APIBASE, routes)

module.exports = app;
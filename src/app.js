const express = require('express');
const bodyParser = require('body-parser');

const routes = require('./routers/index');
const { ErrorHandler, NotFoundHandler, CORS, DevLogs } = require('./middleware/general');

const APIBASE = '/api/v1';
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

app.use(CORS)
app.use(DevLogs)
app.use(APIBASE, routes);

app.use(ErrorHandler);
app.use(NotFoundHandler);

module.exports = app;
const express = require('express');
const bodyParser = require('body-parser');

const routes = require('./routers/index');
const { ErrorHandler, NotFoundError, DevLogs } = require('./middleware/general');
const { EmailTag } = require('./database/repositories/tag.repo');

const APIBASE = '/api/v1';
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

app.use(DevLogs)
app.use(APIBASE, routes);

app.use(ErrorHandler);
app.use(NotFoundError);

async function seedDb() {
  //test code
  const up = await EmailTag.getById('66586250a20b31a2bf0d9610');
  up.emailRecipients = [];
  await up.save();
  console.log(up)
}
// seedDb();

module.exports = app;
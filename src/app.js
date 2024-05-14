const express = require('express');
const bodyParser = require('body-parser');

const routes = require('./routers/index');
const { ErrorHandler, NotFoundError, DevLogs } = require('./middleware/general');
const { MailTrapCredential } = require('./database/models/MailTrapCredential');

const APIBASE = '/api/v1';
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

app.use(DevLogs)
app.use(APIBASE, routes);

app.use(ErrorHandler);
app.use(NotFoundError);

async function test() {
  try {
    const r = await MailTrapCredential.findOne({user:  '663b8db11de4708c82d1e5c3', mailServiceProvider: '66427786fefaf677047bd6dc'});
    // const r = await MailTrapCredential.findById('664284bbe0d6fa02b84b82f6')
    
    console.log('t', r)
  } catch (error) {
    console.log(error)
  }
}

// test();

module.exports = app;
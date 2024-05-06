const runServer = require('./core/runServer');
const connectToDb = require('./database/connection');

connectToDb().then(runServer())


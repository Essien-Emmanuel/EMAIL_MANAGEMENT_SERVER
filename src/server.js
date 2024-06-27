const { runServer } = require('./core/runServer');
const { Database } = require('./database/connection');

Database.getInstance()
.then(runServer())

// Hold the code to the old implementation
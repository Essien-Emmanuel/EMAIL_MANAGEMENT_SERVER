const app = require('../app');
const Config = require('../config');

const { port } = Config.app;

exports.runServer = () => {
  app.listen(port, () => {
    console.log('- App Environment:: ', port);
  }).on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.log(`PORT ${port} Already In Use!`);
    } else {
      console.log(error)
    }
  });
  return
}

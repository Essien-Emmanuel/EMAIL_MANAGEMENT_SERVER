const app = require('./app');
const PORT = 8084

app.listen(PORT, () => {
  console.log('- App Environment:: ', PORT);
}).on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.log(`PORT ${PORT} Already In Use!`);
  } else {
    console.log(error)
  }
})
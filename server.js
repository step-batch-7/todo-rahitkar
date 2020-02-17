const { app } = require('./lib/app');

const port = 1423
  ;
app.listen(port, () => {
  process.stdout.write('listening started');
});

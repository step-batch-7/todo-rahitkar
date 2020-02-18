const { app } = require('./lib/app');

const port = 5000;

app.listen(port, () => {
  process.stdout.write('listening started');
});

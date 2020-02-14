const { app } = require('./lib/routes');

const port = 1423;
app.listen(port, () => {
  process.stdout.write('listening started');
});

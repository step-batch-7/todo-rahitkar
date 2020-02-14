const { app } = require('./lib/routes');

const port = 4000;
app.listen(port, () => {
  process.stdout.write('listening started');
});

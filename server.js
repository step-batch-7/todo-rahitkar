const { app } = require('./lib/app');

const port = process.env.PORT || 5000;

app.listen(port, () => {
  process.stdout.write('listening started');
});

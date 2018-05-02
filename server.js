const app = require('./app');

const db = require('./db');

db
  .connect()
  .then(() => {
    console.log('\nconnection to database established\n');

    if (process.env.NODE_ENV === 'development') {
      const seedDB = require('./seed/seedDevServer');

      return seedDB().then(() => console.log('dev server has been reseeded successfully\n'));
    }
  })
  .then(() => {
    const port = process.env.PORT || 3001;
    app.listen(port, () => {
      console.log(`Listening on http://localhost:${port}\n`);
    });
  })
  .catch(err => {
    console.log('\nUnable to establish connection to the database\n');
    console.log(err);
    process.exit(1);
  });

module.exports = app;

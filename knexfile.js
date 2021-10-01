// Update with your config settings.

module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: './data/taxDB.db3'
    }
  },
  useNullAsDefault: true
};

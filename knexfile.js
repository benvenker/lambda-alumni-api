module.exports = {
  production: {
    client: 'pg',
    connection: {
      host: process.env.DB_URL,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
    },
    pool: {
      max: 20,
      min: 5,
    },
  },
};

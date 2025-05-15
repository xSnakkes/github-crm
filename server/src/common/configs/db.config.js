const dotenv = require('dotenv');

dotenv.config();

const sslOptions = {
  ssl: true,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: true,
    },
  },
};

const sharedConfig = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres',
  define: {
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    lastUpdated: 'last_updated',
    lastUpdatedBy: 'last_updated_by',
  },
  migrationStorageTableName: 'sequelize_meta',
};

module.exports = {
  development: sharedConfig,
  staging: sharedConfig,
  production: {
    ...sharedConfig,
    ...sslOptions,
  },
};

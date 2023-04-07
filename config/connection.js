const Sequelize = require('sequelize');

require('dotenv').config(); // this reads the .env file and adds the variables to process.env

if (process.env.JAWSDB_URL) {
  var sequelize = new Sequelize(process.env.JAWSDB_URL);
}
else {
  const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, { // these are the variables from the .env file
    host: process.env.DB_HOST, // this is the host from the .env file
    dialect: 'mysql',
    port: process.env.DB_PORT, // this is the port from the .env file
    port: 3306,
    define: {
      timestamps: false, // this is to disable the default timestamp fields
      freezeTableName: true, // this is to disable the plural table names
      underscored: true // this is to use snake_case instead of camelCase
    }

  })
};

module.exports = sequelize;
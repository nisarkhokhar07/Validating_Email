// Object for Development Configuration
const dotenv = require("dotenv");
dotenv.config();
// console.log(process.env.DIALECT, process.env.HOST);
module.exports = {
  development: {
    database: process.env.DATABASE,
    username: process.env.USER_NAME,
    password: process.env.PASSWORD,
    host: process.env.HOST,
    dialect: process.env.DIALECT,
  },
  production: {
    database: process.env.DATABASE,
    username: process.env.USER_NAME,
    password: process.env.PASSWORD,
    host: process.env.HOST,
    dialect: process.env.DIALECT,
  },
};

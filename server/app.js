const express = require("express");
const importRoute = require("../routes/importRoute");
const testRoute = require("../routes/testRoute");
const app = express();
const { Sequelize } = require("sequelize");
const config = require("../config/config.json")["development"];

// // Configure database connection
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
  }
);

// Test database connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

// app.use("/importfile", importRoute);
app.use("/", importRoute);
app.use("/testapi", testRoute);

app.listen(5000, () => {
  console.log("server has started on port 5000");
});

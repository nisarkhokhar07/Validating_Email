const { DataTypes } = require("sequelize");
const sq = require("../config/dbconfig");

const emailresponses = sq.define("emailresponses", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  Email: {
    type: DataTypes.STRING,
  },

  Valid: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  Reason: {
    type: DataTypes.STRING,
  },

  Typo: {
    type: DataTypes.BOOLEAN,
  },

  Smtp: {
    type: DataTypes.BOOLEAN,
  },

  Regex: {
    type: DataTypes.BOOLEAN,
  },

  Disposible: {
    type: DataTypes.BOOLEAN,
  },

  Mx: {
    type: DataTypes.BOOLEAN,
  },
});

module.exports = { emailresponses };

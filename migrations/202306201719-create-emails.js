"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("emailresponses", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      Email: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },
      Valid: {
        type: Sequelize.STRING,
      },

      Reason: {
        type: Sequelize.STRING,
      },

      Typo: {
        type: Sequelize.BOOLEAN,
      },

      Smtp: {
        type: Sequelize.BOOLEAN,
      },

      Regex: {
        type: Sequelize.BOOLEAN,
      },

      Disposible: {
        type: Sequelize.BOOLEAN,
      },

      Mx: {
        type: Sequelize.BOOLEAN,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("emailresponses");
  },
};

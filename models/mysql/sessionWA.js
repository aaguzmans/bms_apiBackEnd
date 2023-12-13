const { sequelize } = require("../../config/mysql");
const { DataTypes } = require("sequelize");
const sequelizePaginate = require('sequelize-paginate');

const SessionWA = sequelize.define(
  "session",
  {
    id: {
      type: DataTypes.SMALLINT,
      primaryKey: true,
    },
    sessionId: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      unique:true,
    },
    sessionState: {
      type: DataTypes.STRING,
    },
    deletedAt: { // Agrega la columna "deletedAt" para soft delete
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "session",
    timestamps: true,
    paranoid: true, // Habilita el soft Delete
  }
);

module.exports = SessionWA;

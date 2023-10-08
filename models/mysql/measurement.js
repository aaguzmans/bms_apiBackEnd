const { sequelize } = require("../../config/mysql");
const { DataTypes } = require("sequelize");
const sequelizePaginate = require('sequelize-paginate');

const Measurement = sequelize.define(
  "measurement",
  {
    id: {
      type: DataTypes.SMALLINT,
      primaryKey: true,
    },
    companyId: {
      type: DataTypes.SMALLINT,
    },
    measurementName: {
      type: DataTypes.STRING,
    },
    deletedAt: { // Agrega la columna "deletedAt" para soft delete
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "measurement",
    timestamps: true,
    paranoid: true, // Habilita el soft Delete
  },
);

// Aplica sequelizePaginate a tu modelo
sequelizePaginate.paginate(Measurement);

module.exports = Measurement;

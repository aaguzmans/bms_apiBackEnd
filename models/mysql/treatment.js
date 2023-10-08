const { sequelize } = require("../../config/mysql");
const { DataTypes } = require("sequelize");
const sequelizePaginate = require('sequelize-paginate');

const Treatment = sequelize.define(
  "treatment",
  {
    id: {
      type: DataTypes.SMALLINT,
      primaryKey: true,
    },
    companyId: {
      type: DataTypes.SMALLINT,
    },
    treatmentName: {
      type: DataTypes.STRING,
    },
    dose: {
      type: DataTypes.STRING,
    },
    frequency: {
      type: DataTypes.STRING,
    },
    startDate: {
      type: DataTypes.DATE,
    },
    endDate: {
      type: DataTypes.DATE,
    },
    deletedAt: { // Agrega la columna "deletedAt" para soft delete
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "treatment",
    timestamps: true,
    paranoid: true, // Habilita el soft Delete
  },
);

// Aplica sequelizePaginate a tu modelo
sequelizePaginate.paginate(Treatment);

module.exports = Treatment;

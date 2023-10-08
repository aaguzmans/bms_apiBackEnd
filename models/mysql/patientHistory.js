const { sequelize } = require("../../config/mysql");
const { DataTypes } = require("sequelize");
const sequelizePaginate = require('sequelize-paginate');

const PatientHistory = sequelize.define(
  "patient_history",
  {
    id: {
      type: DataTypes.SMALLINT,
      primaryKey: true,
    },
    companyId: {
      type: DataTypes.SMALLINT,
    },
    patientId: {
      type: DataTypes.SMALLINT,
    },
    alcoholConsumption: {
      type: DataTypes.BOOLEAN,
    },
    smokingHabit: {
      type: DataTypes.BOOLEAN,
    },
    drugsUse: {
      type: DataTypes.BOOLEAN,
    },
    foodAllergies: {
      type: DataTypes.BOOLEAN,
    },
    deletedAt: { // Agrega la columna "deletedAt" para soft delete
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "patient_history",
    timestamps: true,
    paranoid: true, // Habilita el soft Delete
  },
);

// Aplica sequelizePaginate a tu modelo
sequelizePaginate.paginate(PatientHistory);

module.exports = PatientHistory;

const { sequelize } = require("../../config/mysql");
const { DataTypes } = require("sequelize");
const sequelizePaginate = require('sequelize-paginate');

const PatientCase = sequelize.define(
  "patient_case",
  {
    id: {
      type: DataTypes.SMALLINT,
      primaryKey: true,
    },
    companyId: {
      type: DataTypes.SMALLINT,
    },
    patientCaseName: {
      type: DataTypes.STRING,
    },
    lastName: {
      type: DataTypes.STRING,
    },
    lastName2: {
      type: DataTypes.STRING,
    },
    identityCardTypeId: {
      type: DataTypes.SMALLINT,
    },
    identityCard: {
      type: DataTypes.STRING,
    },
    genderId: {
      type: DataTypes.SMALLINT,
    },
    profession: {
      type: DataTypes.STRING,
    },
    dateOfBirth: {
      type: DataTypes.DATE,
    },
    phoneNumber: {
      type: DataTypes.STRING,
    },
    phoneNumber2: {
      type: DataTypes.STRING,
    },
    countryId: {
      type: DataTypes.SMALLINT,
    },
    city: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      unique:true,
    },
    serviceId: {
      type: DataTypes.SMALLINT,
    },
    patientHistoryId: {
      type: DataTypes.SMALLINT,
    },
    treatmentId: {
      type: DataTypes.SMALLINT,
    },
    diseaseId: {
      type: DataTypes.SMALLINT,
    },
    deletedAt: { // Agrega la columna "deletedAt" para soft delete
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "patient_case",
    timestamps: true,
    paranoid: true, // Habilita el soft Delete
  }
);

// Aplica sequelizePaginate a tu modelo
sequelizePaginate.paginate(PatientCase);

module.exports = PatientCase;

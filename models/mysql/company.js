const { sequelize } = require("../../config/mysql");
const { DataTypes } = require("sequelize");
const sequelizePaginate = require('sequelize-paginate');

const Company = sequelize.define(
  "company",
  {
    id: {
      type: DataTypes.SMALLINT,
      primaryKey: true,
    },
    companyName: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
    },
    city: {
      type: DataTypes.STRING,
    },
    state: {
      type: DataTypes.STRING,
    },
    postalCode: {
      type: DataTypes.STRING,
    },
    countryId: {
      type: DataTypes.SMALLINT,
    },
    phoneNumber: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    website: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    deletedAt: { // Agrega la columna "deletedAt" para soft delete
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "company",
    timestamps: true,
    paranoid: true, // Habilita el soft Delete
  },
);

// Aplica sequelizePaginate a tu modelo
sequelizePaginate.paginate(Company);

module.exports = Company;

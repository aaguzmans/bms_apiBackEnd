const { sequelize } = require("../../config/mysql");
const { DataTypes } = require("sequelize");
const sequelizePaginate = require('sequelize-paginate');

const User = sequelize.define(
  "users",
  {
    id: {
      type: DataTypes.SMALLINT,
      primaryKey: true,
    },
    companyId: {
      type: DataTypes.SMALLINT,
    },
    countryId: {
      type: DataTypes.SMALLINT,
    },
    name: {
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
    username: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    rol: {
      type: DataTypes.STRING,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
    },
    deletedAt: { // Agrega la columna "deletedAt" para soft delete
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "users",
    timestamps: true,
    paranoid: true, // Habilita el soft Delete
  }
);

// Aplica sequelizePaginate a tu modelo
sequelizePaginate.paginate(User);

module.exports = User;

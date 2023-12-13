const { sequelize } = require("../../config/mysql");
const { DataTypes } = require("sequelize");
const sequelizePaginate = require('sequelize-paginate');

const Money = sequelize.define(
  "money",
  {
    id: {
      type: DataTypes.SMALLINT,
      primaryKey: true,
    },
    moneyName: {
      type: DataTypes.STRING,
    },
    moneyCode: {
      type: DataTypes.STRING,
    },
    deletedAt: { // Agrega la columna "deletedAt" para soft delete
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "money",
    timestamps: true,
    paranoid: true, // Habilita el soft Delete
  },
);

// Aplica sequelizePaginate a tu modelo
sequelizePaginate.paginate(Money);

module.exports = Money;

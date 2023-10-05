const { sequelize } = require("../../config/mysql");
const { DataTypes } = require("sequelize");

const Money = sequelize.define(
  "money",
  {
    id: {
      type: DataTypes.SMALLINT,
      primaryKey: true,
    },
    companyId: {
      type: DataTypes.SMALLINT,
    },
    moneyName: {
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

module.exports = Money;

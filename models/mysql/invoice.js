const { sequelize } = require("../../config/mysql");
const { DataTypes } = require("sequelize");

const Invoice = sequelize.define(
  "invoice",
  {
    id: {
      type: DataTypes.SMALLINT,
      primaryKey: true,
    },
    companyId: {
      type: DataTypes.SMALLINT,
    },
    code: {
      type: DataTypes.STRING,
    },
    patientId: {
      type: DataTypes.SMALLINT,
    },
    serviceId: {
      type: DataTypes.SMALLINT,
    },
    moneyId: {
      type: DataTypes.SMALLINT,
    },
    percentageDiscount: {
      type: DataTypes.SMALLINT,
    },
    discount: {
      type: DataTypes.FLOAT,
    },
    descriptionDiscount: {
      type: DataTypes.STRING,
    },
    grossCost: {
      type: DataTypes.FLOAT,
    },
    netCost: {
      type: DataTypes.FLOAT,
    },
    totalAmount: {
      type: DataTypes.FLOAT,
    },
    deletedAt: { // Agrega la columna "deletedAt" para soft delete
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "invoice",
    timestamps: true,
    paranoid: true, // Habilita el soft Delete
  }
);

module.exports = Invoice;

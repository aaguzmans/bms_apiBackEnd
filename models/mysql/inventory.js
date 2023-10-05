const { sequelize } = require("../../config/mysql");
const { DataTypes } = require("sequelize");

const Inventory = sequelize.define(
  "inventory",
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
    cabys: {
      type: DataTypes.STRING,
    },
    inventoryName: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    quantity: {
      type: DataTypes.SMALLINT,
    },
    measurementId: {
      type: DataTypes.SMALLINT,
    },
    purchaseDate: {
      type: DataTypes.DATE,
    },
    grossCost: {
      type: DataTypes.FLOAT,
    },
    netCost: {
      type: DataTypes.FLOAT,
    },
    supplierId: {
      type: DataTypes.SMALLINT,
    },
    totalCost: {
      type: DataTypes.FLOAT,
    },
    stockAlert: {
      type: DataTypes.BOOLEAN,
    },
    minimumQuantity: {
      type: DataTypes.SMALLINT,
    },
    deletedAt: { // Agrega la columna "deletedAt" para soft delete
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "inventory",
    timestamps: true,
    paranoid: true, // Habilita el soft Delete
  },
);

module.exports = Inventory;

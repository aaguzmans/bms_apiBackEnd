const { sequelize } = require("../../config/mysql");
const { DataTypes } = require("sequelize");
const sequelizePaginate = require('sequelize-paginate');

const ServiceInventory = sequelize.define(
  "service_inventory",
  {
    id: {
      type: DataTypes.SMALLINT,
      primaryKey: true,
    },
    companyId: {
      type: DataTypes.SMALLINT,
    },
    serviceId: {
      type: DataTypes.SMALLINT,
    },
    inventoryId: {
      type: DataTypes.SMALLINT,
    },
    quantity: {
      type: DataTypes.SMALLINT,
    },
    deletedAt: { // Agrega la columna "deletedAt" para soft delete
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "service_inventory",
    timestamps: true,
    paranoid: true, // Habilita el soft Delete
  }
);

// Aplica sequelizePaginate a tu modelo
sequelizePaginate.paginate(ServiceInventory);

module.exports = ServiceInventory;

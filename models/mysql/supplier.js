const { sequelize } = require("../../config/mysql");
const { DataTypes } = require("sequelize");

const Supplier = sequelize.define(
  "supplier",
  {
    id: {
      type: DataTypes.SMALLINT,
      primaryKey: true,
    },
    companyId: {
      type: DataTypes.SMALLINT,
    },
    supplierName: {
      type: DataTypes.STRING,
    },
    deletedAt: { // Agrega la columna "deletedAt" para soft delete
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "supplier",
    timestamps: true,
    paranoid: true, // Habilita el soft Delete
  },
);

module.exports = Supplier;

const { sequelize } = require("../../config/mysql");
const { DataTypes } = require("sequelize");

const Measurement = sequelize.define(
  "measurement",
  {
    id: {
      type: DataTypes.SMALLINT,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    deletedAt: { // Agrega la columna "deletedAt" para soft delete
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "measurement",
    timestamps: true,
    paranoid: true, // Habilita el soft Delete
  },
);

module.exports = Measurement;

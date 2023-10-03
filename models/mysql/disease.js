const { sequelize } = require("../../config/mysql");
const { DataTypes } = require("sequelize");

const Disease = sequelize.define(
  "disease",
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
    tableName: "disease",
    timestamps: true,
    paranoid: true, // Habilita el soft Delete
  },
);

module.exports = Disease;

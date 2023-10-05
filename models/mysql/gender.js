const { sequelize } = require("../../config/mysql");
const { DataTypes } = require("sequelize");

const Gender = sequelize.define(
  "gender",
  {
    id: {
      type: DataTypes.SMALLINT,
      primaryKey: true,
    },
    companyId: {
      type: DataTypes.SMALLINT,
    },
    genderName: {
      type: DataTypes.STRING,
    },
    deletedAt: { // Agrega la columna "deletedAt" para soft delete
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "gender",
    timestamps: true,
    paranoid: true, // Habilita el soft Delete
  },
);

module.exports = Gender;

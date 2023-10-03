const { sequelize } = require("../../config/mysql");
const { DataTypes } = require("sequelize");

const IdentityCard = sequelize.define(
  "identity_card",
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
    tableName: "identity_card",
    timestamps: true,
    paranoid: true, // Habilita el soft Delete
  },
);

module.exports = IdentityCard;

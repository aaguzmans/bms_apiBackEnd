const { sequelize } = require("../../config/mysql");
const { DataTypes } = require("sequelize");
const sequelizePaginate = require('sequelize-paginate');

const IdentityCard = sequelize.define(
  "identity_card",
  {
    id: {
      type: DataTypes.SMALLINT,
      primaryKey: true,
    },
    companyId: {
      type: DataTypes.SMALLINT,
    },
    identityCardName: {
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

// Aplica sequelizePaginate a tu modelo
sequelizePaginate.paginate(IdentityCard);

module.exports = IdentityCard;

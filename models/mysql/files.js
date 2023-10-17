const { sequelize } = require("../../config/mysql");
const { DataTypes } = require("sequelize");

const Files = sequelize.define(
  "files",
  {
    id: {
      type: DataTypes.SMALLINT,
      primaryKey: true,
    },
    companyId: {
      type: DataTypes.SMALLINT,
    },
    file: {
      type: DataTypes.TEXT,
    },
    fileName: {
      type: DataTypes.STRING,
    },
    fileType: {
        type: DataTypes.STRING,
      },
    deletedAt: {
      // Agrega la columna "deletedAt" para soft delete
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "files",
    timestamps: true,
    paranoid: true, // Habilita el soft Delete
  }
);

module.exports = Files;

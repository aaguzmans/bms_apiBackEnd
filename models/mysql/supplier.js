const { sequelize } = require("../../config/mysql");
const { DataTypes } = require("sequelize");
const sequelizePaginate = require('sequelize-paginate');

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

const Company = require('./company'); // Importa el modelo Service si aún no lo has hecho

Supplier.belongsTo(Company, {
  foreignKey: 'companyId', // Nombre del campo que relaciona PatientCase con Service
  as: 'company', // Alias para la relación
});

// Aplica sequelizePaginate a tu modelo
sequelizePaginate.paginate(Supplier);

module.exports = Supplier;

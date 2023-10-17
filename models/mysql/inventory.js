const { sequelize } = require("../../config/mysql");
const { DataTypes } = require("sequelize");
const sequelizePaginate = require('sequelize-paginate');

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

const Company = require('./company'); // Importa el modelo Service si aún no lo has hecho

Inventory.belongsTo(Company, {
  foreignKey: 'companyId', // Nombre del campo que relaciona PatientCase con Service
  as: 'company', // Alias para la relación
});

const Measurement = require('./measurement'); // Importa el modelo Service si aún no lo has hecho

Inventory.belongsTo(Measurement, {
  foreignKey: 'measurementId', // Nombre del campo que relaciona PatientCase con Service
  as: 'measurement', // Alias para la relación
});

const Supplier = require('./supplier'); // Importa el modelo Service si aún no lo has hecho

Inventory.belongsTo(Supplier, {
  foreignKey: 'supplierId', // Nombre del campo que relaciona PatientCase con Service
  as: 'supplier', // Alias para la relación
});

// Aplica sequelizePaginate a tu modelo
sequelizePaginate.paginate(Inventory);

module.exports = Inventory;

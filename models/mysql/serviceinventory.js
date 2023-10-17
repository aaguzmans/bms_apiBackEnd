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

const Company = require('./company'); // Importa el modelo Service si aún no lo has hecho

ServiceInventory.belongsTo(Company, {
  foreignKey: 'companyId', // Nombre del campo que relaciona PatientCase con Service
  as: 'company', // Alias para la relación
});

const Service = require('./service'); // Importa el modelo Service si aún no lo has hecho

ServiceInventory.belongsTo(Service, {
  foreignKey: 'serviceId', // Nombre del campo que relaciona PatientCase con Service
  as: 'service', // Alias para la relación
});

const Inventory = require('./inventory'); // Importa el modelo Service si aún no lo has hecho

ServiceInventory.belongsTo(Inventory, {
  foreignKey: 'inventoryId', // Nombre del campo que relaciona PatientCase con Service
  as: 'inventory', // Alias para la relación
});

// Aplica sequelizePaginate a tu modelo
sequelizePaginate.paginate(ServiceInventory);

module.exports = ServiceInventory;

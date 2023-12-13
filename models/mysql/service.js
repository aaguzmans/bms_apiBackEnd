const { sequelize } = require("../../config/mysql");
const { DataTypes } = require("sequelize");
const sequelizePaginate = require('sequelize-paginate');

const Service = sequelize.define(
  "service",
  {
    id: {
      type: DataTypes.SMALLINT,
      primaryKey: true,
    },
    companyId: {
      type: DataTypes.SMALLINT,
    },
    moneyId: {
      type: DataTypes.SMALLINT,
    },
    code: {
      type: DataTypes.STRING,
    },
    serviceName: {
      type: DataTypes.STRING,
    },
    descriptionService: {
      type: DataTypes.STRING,
    },
    cost: {
      type: DataTypes.FLOAT,
    },
    deletedAt: { // Agrega la columna "deletedAt" para soft delete
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "service",
    timestamps: true,
    paranoid: true, // Habilita el soft Delete
  }
);

const Company = require('./company'); // Importa el modelo Service si aún no lo has hecho

Service.belongsTo(Company, {
  foreignKey: 'companyId', // Nombre del campo que relaciona PatientCase con Service
  as: 'company', // Alias para la relación
});

const Money = require('./money'); // Importa el modelo Service si aún no lo has hecho

Service.belongsTo(Money, {
  foreignKey: 'moneyId', // Nombre del campo que relaciona PatientCase con Service
  as: 'money', // Alias para la relación
});

// Aplica sequelizePaginate a tu modelo
sequelizePaginate.paginate(Service);

module.exports = Service;

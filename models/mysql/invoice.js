const { sequelize } = require("../../config/mysql");
const { DataTypes } = require("sequelize");
const sequelizePaginate = require('sequelize-paginate');

const Invoice = sequelize.define(
  "invoice",
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
    patientId: {
      type: DataTypes.SMALLINT,
    },
    serviceId: {
      type: DataTypes.SMALLINT,
    },
    moneyId: {
      type: DataTypes.SMALLINT,
    },
    percentageDiscount: {
      type: DataTypes.SMALLINT,
    },
    discount: {
      type: DataTypes.FLOAT,
    },
    descriptionDiscount: {
      type: DataTypes.STRING,
    },
    grossCost: {
      type: DataTypes.FLOAT,
    },
    netCost: {
      type: DataTypes.FLOAT,
    },
    totalAmount: {
      type: DataTypes.FLOAT,
    },
    deletedAt: { // Agrega la columna "deletedAt" para soft delete
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "invoice",
    timestamps: true,
    paranoid: true, // Habilita el soft Delete
  }
);

const Company = require('./company'); // Importa el modelo Service si aún no lo has hecho

Invoice.belongsTo(Company, {
  foreignKey: 'companyId', // Nombre del campo que relaciona PatientCase con Service
  as: 'company', // Alias para la relación
});

const PatientCase = require('./patientCase'); // Importa el modelo Service si aún no lo has hecho

Invoice.belongsTo(PatientCase, {
  foreignKey: 'patientId', // Nombre del campo que relaciona PatientCase con Service
  as: 'patientCase', // Alias para la relación
});

const Service = require('./service'); // Importa el modelo Service si aún no lo has hecho

Invoice.belongsTo(Service, {
  foreignKey: 'serviceId', // Nombre del campo que relaciona PatientCase con Service
  as: 'service', // Alias para la relación
});

const Money = require('./money'); // Importa el modelo Service si aún no lo has hecho

Invoice.belongsTo(Money, {
  foreignKey: 'moneyId', // Nombre del campo que relaciona PatientCase con Service
  as: 'money', // Alias para la relación
});

// Aplica sequelizePaginate a tu modelo
sequelizePaginate.paginate(Invoice);

module.exports = Invoice;

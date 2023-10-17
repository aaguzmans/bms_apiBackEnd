const { sequelize } = require("../../config/mysql");
const { DataTypes } = require("sequelize");
const sequelizePaginate = require('sequelize-paginate');

const PatientCase = sequelize.define(
  "patient_case",
  {
    id: {
      type: DataTypes.SMALLINT,
      primaryKey: true,
    },
    companyId: {
      type: DataTypes.SMALLINT,
    },
    patientCaseName: {
      type: DataTypes.STRING,
    },
    lastName: {
      type: DataTypes.STRING,
    },
    lastName2: {
      type: DataTypes.STRING,
    },
    identityCardTypeId: {
      type: DataTypes.SMALLINT,
    },
    identityCard: {
      type: DataTypes.STRING,
    },
    genderId: {
      type: DataTypes.SMALLINT,
    },
    profession: {
      type: DataTypes.STRING,
    },
    dateOfBirth: {
      type: DataTypes.DATE,
    },
    phoneNumber: {
      type: DataTypes.STRING,
    },
    phoneNumber2: {
      type: DataTypes.STRING,
    },
    countryId: {
      type: DataTypes.SMALLINT,
    },
    city: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      unique:true,
    },
    serviceId: {
      type: DataTypes.SMALLINT,
    },
    patientHistoryId: {
      type: DataTypes.SMALLINT,
    },
    treatmentId: {
      type: DataTypes.SMALLINT,
    },
    diseaseId: {
      type: DataTypes.SMALLINT,
    },
    deletedAt: { // Agrega la columna "deletedAt" para soft delete
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "patient_case",
    timestamps: true,
    paranoid: true, // Habilita el soft Delete
  }
);

const Company = require('./company'); // Importa el modelo Service si aún no lo has hecho

PatientCase.belongsTo(Company, {
  foreignKey: 'companyId', // Nombre del campo que relaciona PatientCase con Service
  as: 'company', // Alias para la relación
});

const IdentityCardTypeId = require('./identityCard'); // Importa el modelo Service si aún no lo has hecho

PatientCase.belongsTo(IdentityCardTypeId, {
  foreignKey: 'identityCardTypeId', // Nombre del campo que relaciona PatientCase con Service
  as: 'identityCardType', // Alias para la relación
});

const Gender = require('./gender'); // Importa el modelo Service si aún no lo has hecho

PatientCase.belongsTo(Gender, {
  foreignKey: 'genderId', // Nombre del campo que relaciona PatientCase con Service
  as: 'gender', // Alias para la relación
});

const Country = require('./country'); // Importa el modelo Service si aún no lo has hecho

PatientCase.belongsTo(Country, {
  foreignKey: 'countryId', // Nombre del campo que relaciona PatientCase con Service
  as: 'country', // Alias para la relación
});

const Service = require('./service'); // Importa el modelo Service si aún no lo has hecho

PatientCase.belongsTo(Service, {
  foreignKey: 'serviceId', // Nombre del campo que relaciona PatientCase con Service
  as: 'service', // Alias para la relación
});

const PatientHistory = require('./patientHistory'); // Importa el modelo Service si aún no lo has hecho

PatientCase.belongsTo(PatientHistory, {
  foreignKey: 'patientHistoryId', // Nombre del campo que relaciona PatientCase con Service
  as: 'patientHistory', // Alias para la relación
});

const Treatment = require('./treatment'); // Importa el modelo Service si aún no lo has hecho

PatientCase.belongsTo(Treatment, {
  foreignKey: 'treatmentId', // Nombre del campo que relaciona PatientCase con Service
  as: 'treatment', // Alias para la relación
});

const Disease = require('./disease'); // Importa el modelo Service si aún no lo has hecho

PatientCase.belongsTo(Disease, {
  foreignKey: 'diseaseId', // Nombre del campo que relaciona PatientCase con Service
  as: 'disease', // Alias para la relación
});

// Aplica sequelizePaginate a tu modelo
sequelizePaginate.paginate(PatientCase);

module.exports = PatientCase;

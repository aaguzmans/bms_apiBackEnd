const { sequelize } = require("../../config/mysql");
const { DataTypes } = require("sequelize");
const sequelizePaginate = require('sequelize-paginate');

const User = sequelize.define(
  "users",
  {
    id: {
      type: DataTypes.SMALLINT,
      primaryKey: true,
    },
    companyId: {
      type: DataTypes.SMALLINT,
    },
    countryId: {
      type: DataTypes.SMALLINT,
    },
    name: {
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
    senderEmailPass: {
      type: DataTypes.STRING,
    },
    username: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    rol: {
      type: DataTypes.STRING,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
    },
    deletedAt: { // Agrega la columna "deletedAt" para soft delete
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "users",
    timestamps: true,
    paranoid: true, // Habilita el soft Delete
  }
);

const Company = require('./company'); // Importa el modelo Service si aún no lo has hecho

User.belongsTo(Company, {
  foreignKey: 'companyId', // Nombre del campo que relaciona User con Company
  as: 'company', // Alias para la relación
});

const Country = require('./country'); // Importa el modelo Service si aún no lo has hecho

User.belongsTo(Country, {
  foreignKey: 'countryId', // Nombre del campo que relaciona User con Service
  as: 'country', // Alias para la relación
});

const IdentityCardTypeId = require('./identityCard'); // Importa el modelo Service si aún no lo has hecho

User.belongsTo(IdentityCardTypeId, {
  foreignKey: 'identityCardTypeId', // Nombre del campo que relaciona PatientCase con Service
  as: 'identityCardType', // Alias para la relación
});

const Gender = require('./gender'); // Importa el modelo Service si aún no lo has hecho

User.belongsTo(Gender, {
  foreignKey: 'genderId', // Nombre del campo que relaciona PatientCase con Service
  as: 'gender', // Alias para la relación
});

// Aplica sequelizePaginate a tu modelo
sequelizePaginate.paginate(User);

module.exports = User;

const { sequelize } = require("../../config/mysql");
const { DataTypes } = require("sequelize");
const sequelizePaginate = require('sequelize-paginate');

const AppointmentSchedule = sequelize.define(
  "appointment_schedule",
  {
    id: {
      type: DataTypes.SMALLINT,
      primaryKey: true,
    },
    companyId: {
      type: DataTypes.SMALLINT,
    },
    patientId: {
      type: DataTypes.SMALLINT,
    },
    serviceId: {
      type: DataTypes.SMALLINT,
    },
    appointmentDate: {
      type: DataTypes.DATE,
    },
    appointmentEndDate: {
      type: DataTypes.DATE
    },
    appointmentNotes: {
      type: DataTypes.STRING,
    },
    deletedAt: { // Agrega la columna "deletedAt" para soft delete
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "appointment_schedule",
    timestamps: true,
    paranoid: true, // Habilita el soft Delete
  },
);

const Company = require('./company'); // Importa el modelo Service si aún no lo has hecho

AppointmentSchedule.belongsTo(Company, {
  foreignKey: 'companyId', // Nombre del campo que relaciona PatientCase con Service
  as: 'company', // Alias para la relación
});

const PatientCase = require('./patientCase'); // Importa el modelo Service si aún no lo has hecho

AppointmentSchedule.belongsTo(PatientCase, {
  foreignKey: 'patientId', // Nombre del campo que relaciona PatientCase con Service
  as: 'patientCase', // Alias para la relación
});

const Service = require('./service'); // Importa el modelo Service si aún no lo has hecho

AppointmentSchedule.belongsTo(Service, {
  foreignKey: 'serviceId', // Nombre del campo que relaciona PatientCase con Service
  as: 'service', // Alias para la relación
});

// Aplica sequelizePaginate a tu modelo
sequelizePaginate.paginate(AppointmentSchedule);

module.exports = AppointmentSchedule;

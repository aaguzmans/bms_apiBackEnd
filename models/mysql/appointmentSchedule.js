const { sequelize } = require("../../config/mysql");
const { DataTypes } = require("sequelize");

const AppointmentSchedule = sequelize.define(
  "appointmentSchedule",
  {
    id: {
      type: DataTypes.SMALLINT,
      primaryKey: true,
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
    appointmentNotes: {
      type: DataTypes.STRING,
    },
    deletedAt: { // Agrega la columna "deletedAt" para soft delete
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "appointmentSchedule",
    timestamps: true,
    paranoid: true, // Habilita el soft Delete
  },
);

module.exports = AppointmentSchedule;

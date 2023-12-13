const { check } = require("express-validator");
const validateResults = require("../utils/handleValidator");

const validatorCreateItem = [
  check("companyId"),
  check("patientId"),
  check("serviceId"),
  check("appointmentDate").isLength({ max: 20 }),
  check("appointmentEndDate"),
  check("appointmentNotes").isLength({ max: 250 }),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

const validatorGetItem = [
  check("id").exists(),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

const validatorGetPatientId = [
  check("patientId").exists(),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

module.exports = { validatorGetItem, validatorGetPatientId, validatorCreateItem };

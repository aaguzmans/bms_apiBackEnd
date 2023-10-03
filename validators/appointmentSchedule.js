const { check } = require("express-validator");
const validateResults = require("../utils/handleValidator");
const isValidDate = require("../utils/handleCustomDate");

const validatorCreateItem = [
  check("patientId"),
  check("serviceId"),
  check("appointmentDate").custom(isValidDate),
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

module.exports = { validatorGetItem, validatorCreateItem };

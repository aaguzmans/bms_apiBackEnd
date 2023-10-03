const { check } = require("express-validator");
const validateResults = require("../utils/handleValidator");
const isValidDate = require("../utils/handleCustomDate");

const validatorCreateItem = [
  check("name").isLength({ max: 50 }),
  check("patientId"),
  check("alcoholConsumption").isBoolean(),
  check("smokingHabit").isBoolean(),
  check("drugsUse").isBoolean(),
  check("foodAllergies").isBoolean(),
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

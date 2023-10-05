const { check } = require("express-validator");
const validateResults = require("../utils/handleValidator");

const validatorCreateItem = [
  check("companyId"),
  check("treatmentName").isLength({ max: 50 }),
  check("dose").isLength({ max: 50 }),
  check("frequency").isLength({ max: 50 }),
  check("startDate"),
  check("endDate"),
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

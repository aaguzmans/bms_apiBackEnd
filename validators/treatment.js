const { check } = require("express-validator");
const validateResults = require("../utils/handleValidator");
const isValidDate = require("../utils/handleCustomDate");

const validatorCreateItem = [
  check("name").isLength({ max: 50 }),
  check("dose").isLength({ max: 50 }),
  check("frequency").isLength({ max: 50 }),
  check("startDate").custom(isValidDate),
  check("endDate").custom(isValidDate),
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

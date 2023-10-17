const { check } = require("express-validator");
const validateResults = require("../utils/handleValidator");

const validatorCreateItem = [
  check("moneyName").isLength({ max: 20 }),
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

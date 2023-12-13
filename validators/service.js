const { check } = require("express-validator");
const validateResults = require("../utils/handleValidator");

const validatorCreateItem = [
  check("companyId"),
  check("code").isLength({ max: 20 }),
  check("serviceName").exists().notEmpty(),
  check("descriptionService").isLength({ max: 500 }),
  check("cost").isFloat(),
  check("moneyId"),
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

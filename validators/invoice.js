const { check } = require("express-validator");
const validateResults = require("../utils/handleValidator");

const validatorCreateItem = [
  check("code").isLength({ max: 20 }),
  check("patientId"),
  check("serviceId"),
  check("moneyId"),
  check("percentageDiscount").isNumeric(),
  check("discount").isFloat(),
  check("descriptionDiscount").isLength({ max: 500 }),
  check("grossCost").isFloat(),
  check("netCost").isFloat(),
  check("totalAmount").isFloat(),
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

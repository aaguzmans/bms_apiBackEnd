const { check } = require("express-validator");
const validateResults = require("../utils/handleValidator");

const validatorCreateItem = [
  check("companyId"),
  check("code").isLength({ max: 20 }),
  check("patientId"),
  check("serviceId"),
  check("moneyId"),
  check("percentageDiscount"),
  check("discount"),
  check("descriptionDiscount"),
  check("grossCost"),
  check("netCost"),
  check("totalAmount"),
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

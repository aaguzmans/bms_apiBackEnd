const { check } = require("express-validator");
const validateResults = require("../utils/handleValidator");

const validatorCreateItem = [
  check("companyId"),
  check("code").isLength({ max: 20 }),
  check("cabys").isLength({ max: 20 }),
  check("inventoryName").exists().notEmpty(),
  check("description").isLength({ max: 500 }),
  check("quantity").isNumeric(),
  check("measurementId"),
  check("purchaseDate"),
  check("grossCost").isFloat(),
  check("netCost").isFloat(),
  check("supplierId"),
  check("totalCost").isFloat(),
  check("stockAlert").isBoolean(),
  check("minimumQuantity").isNumeric(),
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

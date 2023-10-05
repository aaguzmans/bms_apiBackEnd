const { check } = require("express-validator");
const validateResults = require("../utils/handleValidator");

const validatorCreateItem = [
  check("companyName").exists().notEmpty(),
  check("address").isLength({ max: 100 }),
  check("city").isLength({ max: 50 }),
  check("state").isLength({ max: 50 }),
  check("postalCode").isLength({ max: 10 }),
  check("countryId"),
  check("phoneNumber").isLength({ max: 15 }),
  check("email").isLength({ max: 50 }),
  check("website").isLength({ max: 50 }),
  check("description").isLength({ max: 200 }),
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

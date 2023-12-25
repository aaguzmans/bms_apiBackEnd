const { check } = require("express-validator");
const validateResults = require("../utils/handleValidator");

const validatorCreateItem = [
  check("companyId"),
  check("name").isLength({ max: 50 }),
  check("lastName").isLength({ max: 50 }),
  check("lastName2").isLength({ max: 50 }),
  check("identityCardTypeId"),
  check("identityCard").isLength({ max: 15 }),
  check("genderId"),
  check("profession").isLength({ max: 50 }),
  check("dateOfBirth"),
  check("phoneNumber").isLength({ max: 15 }),
  check("phoneNumber2").isLength({ max: 15 }),
  check("countryId"),
  check("city").isLength({ max: 50 }),
  check("address").isLength({ max: 250 }),
  check("email").isLength({ max: 50 }),
  check("senderEmailPass"),
  check("username").isLength({ max: 50 }),
  check("password").isLength({ max: 150 }),
  check("rol").isLength({ max: 25 }),
  check("isActive").isBoolean(),
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

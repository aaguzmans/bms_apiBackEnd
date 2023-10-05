const { check } = require("express-validator");
const validateResults = require("../utils/handleValidator");

const validatorRegister = [
  check("companyName").exists().notEmpty(),
  check("companyId"),
  check("name").exists().notEmpty(),
  check("username").exists().notEmpty(),
  check("password").exists().notEmpty(),
  check("email").isEmail(),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

const validatorLogin = [
    check("email").isEmail(),
    check("password").exists().notEmpty(),
    (req, res, next) => {
      return validateResults(req, res, next);
    },
  ];

module.exports = { validatorRegister, validatorLogin };
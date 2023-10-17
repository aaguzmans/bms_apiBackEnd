const { check } = require("express-validator");
const validateResults = require("../utils/handleValidator");

const validatorCreateItem = [
  check("companyId"),
  check("patientCaseName").isLength({ max: 50 }),
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
  check("serviceId"),
  check("patientHistoryId"),
  check("treatmentId"),
  check("diseaseId"),
  check("alcoholConsumption"),
  check("smokingHabit"),
  check("drugsUse"),
  check("foodAllergies"),
  check("treatmentName"),
  check("dose"),
  check("frequency"),
  check("startDate"),
  check("endDate"),
  check("diseaseName"),
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

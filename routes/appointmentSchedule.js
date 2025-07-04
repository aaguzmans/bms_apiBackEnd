const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/session");
const checkRol = require("../middleware/rol");
const {
  validatorGetItem,
  validatorGetPatientId,
  validatorCreateItem,
} = require("../validators/appointmentSchedule");
const {
  getItems,
  getItem,
  getItemsByPatientId,
  createItem,
  updateItem,
  deleteItem,
} = require("../controllers/appointmentSchedule");

router.get("/", authMiddleware, checkRol(["admin"]), getItems);

router.get(
  "/:id",
  authMiddleware,
  checkRol(["admin"]),
  validatorGetItem,
  getItem
);

router.get(
  "/patient/:patientId",
  authMiddleware,
  checkRol(["admin"]),
  validatorGetPatientId,
  getItemsByPatientId
);

// Modificada para permitir filtros
router.get(
  "/filtered",
  authMiddleware,
  checkRol(["admin"]),
  validatorGetItem,
  getItems
);

router.post(
  "/",
  authMiddleware,
  checkRol(["admin"]),
  validatorCreateItem,
  createItem
);

router.put(
  "/:id",
  authMiddleware,
  checkRol(["admin"]),
  validatorGetItem,
  validatorCreateItem,
  updateItem
);

router.delete(
  "/:id",
  authMiddleware,
  checkRol(["admin"]),
  validatorGetItem,
  deleteItem
);

module.exports = router;

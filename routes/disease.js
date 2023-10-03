const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/session")
const checkRol  = require("../middleware/rol")
const { validatorGetItem, validatorCreateItem } = 
require("../validators/disease")
const { getItems, getItem, createItem, updateItem, deleteItem } = 
require("../controllers/disease");

router.get("/", authMiddleware, checkRol(["admin"]), getItems);

router.get("/:id",authMiddleware, checkRol(["admin"]), validatorGetItem, getItem);

router.post("/",authMiddleware, checkRol(["admin"]), validatorCreateItem, createItem);

router.put("/:id",authMiddleware, checkRol(["admin"]), validatorGetItem, validatorCreateItem, updateItem);

router.delete("/:id",authMiddleware, checkRol(["admin"]), validatorGetItem, deleteItem);

module.exports = router
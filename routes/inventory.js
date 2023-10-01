const express = require("express");
const router = express.Router();
const { validatorGetItem, validatorCreateItem } = require("../validators/inventory")
const { getItems, getItem, createItem, updateItem, deleteItem } = require("../controllers/inventory");

router.get("/",getItems);

router.get("/:id", validatorGetItem, getItem);

router.post("/", validatorCreateItem, createItem);

router.put("/:id", validatorGetItem, validatorCreateItem, updateItem);

router.delete("/:id", validatorGetItem, deleteItem);

module.exports = router
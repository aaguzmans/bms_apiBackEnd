const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/session")
const checkRol  = require("../middleware/rol")
const { validatorGetItem } = 
require("../validators/files")
const { getItems, getItem, createItem, updateItem, deleteItem } = 
require("../controllers/files");
const { upload } = require("../utils/handleStorage");

router.get("/", authMiddleware, checkRol(["admin"]), getItems);

router.get("/:id", authMiddleware, checkRol(["admin"]), validatorGetItem, getItem);

router.post("/", authMiddleware, checkRol(["admin"]), upload.single("file"), createItem);

router.put("/:id", authMiddleware, checkRol(["admin"]), validatorGetItem, updateItem);

router.delete("/:id", authMiddleware, checkRol(["admin"]), validatorGetItem, deleteItem);

module.exports = router;
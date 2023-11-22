const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/session");
const checkRol = require("../middleware/rol");
const {  whatsappBot } = require("../controllers/whatsappBot");

//router.get("/", authMiddleware, checkRol(["admin"]), whatsappNotification);
router.get("/", authMiddleware, checkRol(["admin"]), whatsappBot);

// Ruta para obtener el código QR
//router.get("/getQRCode", authMiddleware, checkRol(["admin"]), getQRCode);

module.exports = router;

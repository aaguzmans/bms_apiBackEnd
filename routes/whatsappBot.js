const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/session")
const checkRol  = require("../middleware/rol")
const { GETQRCODE } = require("../controllers/whatsappBot");

router.get('/getQRCODE', authMiddleware, checkRol(["admin"]), GETQRCODE);

module.exports = router;
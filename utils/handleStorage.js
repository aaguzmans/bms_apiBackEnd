const multer = require("multer");

// Configura la ubicación y el nombre del archivo
const storage = multer.memoryStorage();

const upload = multer({ storage });

module.exports = { upload };



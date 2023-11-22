const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/session")
const checkRol  = require("../middleware/rol")
const { validatorGetItem, validatorCreateItem } = 
require("../validators/patientCase")
const { getItems, getItem, getLatestItem, createItem, updateItem, deleteItem } = 
require("../controllers/patientCase");

router.get("/", authMiddleware, checkRol(["admin"]), getItems);

router.get("/latestPatient/",authMiddleware, checkRol(["admin"]), getLatestItem);

router.get("/:id",authMiddleware, checkRol(["admin"]), validatorGetItem, getItem);

router.post("/",authMiddleware, checkRol(["admin"]), validatorCreateItem, createItem);

router.put("/:id",authMiddleware, checkRol(["admin"]), validatorGetItem, validatorCreateItem, updateItem);

router.delete("/:id",authMiddleware, checkRol(["admin"]), validatorGetItem, deleteItem);

module.exports = router

/*
La ruta /:id es más general, ya que puede coincidir con cualquier cadena después de la barra (/). 
Si tienes una solicitud como /latestPatient/, Express interpretará latestPatient como un valor 
de :id en lugar de una ruta específica.

Para abordar esto, puedes cambiar el orden de tus rutas para colocar las rutas más específicas 
antes de las más generales. En este caso, podrías intercambiar el orden de las dos rutas para 
que la ruta más específica (/latestPatient/) se evalúe antes de la ruta más general (/:id).

Al hacer esto, Express primero intentará hacer coincidir la solicitud con la ruta /latestPatient/, 
y solo si no coincide, considerará la ruta /:id. Esto debería resolver problemas potenciales donde
la ruta más general coincide inadvertidamente con una ruta más específica.

*/
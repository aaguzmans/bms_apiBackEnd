const { handleHttpError } = require("../utils/handleError");
const { verifyToken } = require("../utils/handleJwt");
const { userModel } = require("../models");

const authMiddleware = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      //si no existe un token
      handleHttpError(res, "NEED_SESSION", 401);
      return;
    }

    const token = req.headers.authorization.split(" ").pop();
    const dataToken = await verifyToken(token);

    // if (dataToken) {
    //   //si no existe data en el payload
    //   handleHttpError(res, "NOT_PAYLOAD_DATA", 401);
    //   return;
    // }

    if (!dataToken.id) {
      //si no existe un Id
      handleHttpError(res, "ERROR_ID_TOKEN", 401);
      return;
    }

    //filtro la data para saber quien es el usuario que realizo esta peticion
    const user = await userModel.findByPk(dataToken.id, {
      attributes: ["id", "companyId", "username", "rol"],
    });

    req.user = user;

    next(); //si no hay errores, continua
  } catch (error) {
    handleHttpError(res, "NOT_SESSION", 401);
  }
};

module.exports = authMiddleware;

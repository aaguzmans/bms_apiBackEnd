const { matchedData } = require("express-validator");
const { encrypt, compare } = require("../utils/handlePassword");
const { tokenSign } = require("../utils/handleJwt");
const { userModel, companyModel } = require("../models");
const { handleHttpError } = require("../utils/handleError");

const registerCtrl = async (req, res) => {
  try {
    req = matchedData(req);

    // Crear la compañía para generar su ID
    await companyModel.create({
      companyName: req.companyName,
    });

    // Obtener el registro de la compañía usando companyName
    const company = await companyModel.findOne({
      where: { companyName: req.companyName },
    });

    if (!company) {
      handleHttpError(res, "COMPANY_NOT_FOUND");
      return;
    }

    // Obtener el ID de la compañía recién creada
    const companyId = company.id;

    const password = await encrypt(req.password);

    //spread operator, nos permite
    // copiar una parte de un elemento array o un objeto
    const body = { ...req, password, companyId: companyId }; // Asocia el usuario a la compañía recién creada.

    const dataUser = await userModel.create(body);
    //dataUser.set("password", undefined, { strict:false });

    const token = await tokenSign(dataUser);
    //--------adicionalmente crea el JWT---------------------------
    const data = {
      token: token,
      user: dataUser,
    };
    //--------adicionalmente crea el JWT---------------------------

    res.send({ data });
  } catch (error) {
    handleHttpError(res, "ERROR_REGISTER_USER");
  }
};

const loginCtrl = async (req, res) => {
  try {
    const body = matchedData(req);
    const user = await userModel.findOne({
      where: { email: body.email },
      attributes: ["id", "companyId", "username", "password", "email", "rol"],
    });

    if (!user) {
      handleHttpError(res, "USER_NOT_EXISTS", 404);
      return;
    }

    const hashPassword = user.password;
    //si da false en caso de que las contraseñas coincidan,
    //podria deberse a que la contraseña se corta en base de datos por el tamaño del campo
    const checkPassword = await compare(body.password, hashPassword);

    if (!checkPassword) {
      handleHttpError(res, "PASSWORD_INVALID", 401);
      return;
    }

    user.set("password", undefined, { stric: false });
    //--------adicionalmente consulta el JWT---------------------------
    const tokenJwt = await tokenSign(user);

    const data = {
      token: tokenJwt,
      user: user,
    };
    //--------adicionalmente consulta el JWT---------------------------

    res.send({ data });
  } catch (error) {
    console.log(error);
    handleHttpError(res, "ERROR_LOGIN_USER");
  }
};

module.exports = { loginCtrl, registerCtrl };

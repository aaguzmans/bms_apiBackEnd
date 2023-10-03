const { matchedData } = require("express-validator");
const { encrypt, compare } = require("../utils/handlePassword");
const { tokenSign } = require("../utils/handleJwt");
const { userModel } = require("../models");
const { handleHttpError } = require("../utils/handleError");

const registerCtrl = async (req, res) => {
  try {
    req = matchedData(req);

    const password = await encrypt(req.password);
    //spread operator, nos permite
    // copiar una parte de un elemento array o un objeto
    const body = { ...req, password };

    const dataUser = await userModel.create(body);
    //dataUser.set("password", undefined, { strict:false });

    const token = await tokenSign(dataUser);
    //--------adicionalmente crea el JWT--------------------------- NO ESTA DEVOLVIENDO DATOS DE PAYLOAD
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
      attributes: ["id","username", "password", "email", "rol"],
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

    user.set('password',undefined, {stric:false})
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

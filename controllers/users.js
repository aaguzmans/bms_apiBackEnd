const { matchedData } = require("express-validator");
const { userModel } = require("../models");
const { handleHttpError } = require("../utils/handleError");
const { encrypt } = require("../utils/handlePassword");

const getItems = async (req, res) => {
  try {

    //para saber quien es la persona que esta consumiendo la peticion, la llamamos por medio de los datos de la sesion
    const user = req.user;

    // Obtener el ID de la compañía asociada al usuario
    const companyId = user.companyId;

    // Consulta los registros donde companyId coincida con user.companyId
    const data = await userModel.findAll({
      where: {
        companyId: companyId
      }
    });

    res.send({ data, user });
  } catch (error) {
    handleHttpError(res, "ERROR_GET_ITEMS");
  }
};

const getItem = async (req, res) => {
  try {
    //para saber quien es la persona que esta consumiendo la peticion, la llamamos por medio de los datos de la sesion
    const user = req.user;

    // Obtener el ID de la compañía asociada al usuario
    const companyId = user.companyId;

    req = matchedData(req);
    const { id } = req;
    // Consulta el registro por su clave primaria (id) y donde companyId coincida con user.companyId
    const data = await userModel.findOne({
      where: {
        id,
        companyId: companyId
      }
    });

    res.send({ data, user });
  } catch (error) {
    handleHttpError(res, "ERROR_GET_ITEM");
  }
};

const createItem = async (req, res) => {
  try {
    //para saber quien es la persona que esta consumiendo la peticion, la llamamos por medio de los datos de la sesion
    const user = req.user;

    // Obtener el ID de la compañía asociada al usuario
    const companyId = user.companyId;

    const body = matchedData(req);

    // Verificar si el correo electrónico ya existe en la base de datos
    const existingUser = await userModel.findOne({
      where: {
        companyId: companyId,
        email: body.email
      }
    });

    if (existingUser) {
      handleHttpError(res, "EMAIL_ALREADY_USED", 404);
      return;}

    // Asignar companyId al campo companyId del body
    body.companyId = companyId;

    // Verifica si se proporcionó una nueva contraseña y la encripta
    if (body.password) {
      const password = await encrypt(body.password);
      body.password = password;
    }

    const data = await userModel.create(body);
    res.send({ data, user });
  } catch (error) {
    handleHttpError(res, "ERROR_CREATE_ITEMS");
  }
};

const updateItem = async (req, res) => {
  try {
    const { id, ...body } = matchedData(req);
    // const data = await companyModel.findOneAndUpdate( id, body );
    // res.send({ data });

    // Find the record by its primary key (id)
    const existingItem = await userModel.findByPk(id);

    if (!existingItem) {
      handleHttpError(res, "ITEM_NOT_FOUND", 404);
      return;
    }

    // Verifica si se proporcionó una nueva contraseña y la encripta
    if (body.password) {
      const password = await encrypt(body.password);
      body.password = password;
    }

    // Update the attributes of the found record
    await existingItem.update(body);

    res.send({ data: existingItem });
  } catch (error) {
    handleHttpError(res, "ERROR_UPDATE_ITEMS");
  }
};

const deleteItem = async (req, res) => {
  try {
    const { id } = matchedData(req);

    // Encuentra el registro que deseas marcar como eliminado
    const existingItem = await userModel.findByPk(id);

    if (!existingItem) {
      handleErrorResponse(res, "ITEM_NOT_FOUND", 404);
      return;
    }

    // Marca el registro como eliminado (soft delete) en el campo DeletedAt con la fecha de "eliminacion"
    await existingItem.destroy();

    res.send({ data: existingItem });
  } catch (error) {
    handleHttpError(res, "ERROR_DELETE_ITEM");
  }
};

module.exports = { getItems, getItem, createItem, updateItem, deleteItem };

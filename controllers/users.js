const { matchedData } = require("express-validator");
const {
  userModel,
  companyModel,
  identityCardModel,
  genderModel,
  countryModel,
} = require("../models");
const { handleHttpError } = require("../utils/handleError");
const { encrypt, compare } = require("../utils/handlePassword");
const sequelizePaginate = require("sequelize-paginate");

const getItems = async (req, res) => {
  try {
    //para saber quien es la persona que esta consumiendo la peticion, la llamamos por medio de los datos de la sesion
    const user = req.user;

    // Obtener el ID de la compañía asociada al usuario
    const companyId = user.companyId;

    const { page, per_page } = req.query; // Obtén los parámetros de paginación
    const pageSize = Math.max(parseInt(per_page), 8); // Asegúrate de que per_page sea al menos 8

    const { docs, pages, total } = await userModel.paginate({
      where: {
        companyId: companyId,
      },
      page: parseInt(page), // Convierte a número entero
      paginate: pageSize, // Establece el tamaño de la página
      include: [
        {
          model: identityCardModel,
          as: "identityCardType",
        },
        {
          model: genderModel, // Suponiendo que tienes un modelo llamado "Service" configurado
          as: "gender", // El nombre de la relación en el modelo "PatientCase"
        },
        {
          model: countryModel,
          as: "country",
        },
        {
          model: companyModel, // Suponiendo que tienes un modelo llamado "Service" configurado
          as: "company", // El nombre de la relación en el modelo "PatientCase"
        },
      ],
    });

    res.send({ data: docs, user, pages, total, per_page: pageSize }); // Agrega el campo per_page a la respuesta
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
        companyId: companyId,
      },
      include: [
        {
          model: identityCardModel,
          as: "identityCardType",
        },
        {
          model: genderModel,
          as: "gender",
        },
        {
          model: countryModel,
          as: "country",
        },
        {
          model: companyModel,
          as: "company",
        },
      ],
    });

    res.send({ data, user });
  } catch (error) {
    console.log(error);
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
        email: body.email,
      },
    });

    if (existingUser) {
      handleHttpError(res, "EMAIL_ALREADY_USED", 404);
      return;
    }

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

    // Encuentra el registro por su clave primaria (id)
    const existingItem = await userModel.findByPk(id);

    if (!existingItem) {
      handleHttpError(res, "ITEM_NOT_FOUND", 404);
      return;
    }

    if (body.password) {
      // Verifica si la contraseña proporcionada es más corta de 30 caracteres
      if (body.password.length < 30) {
        const newPasswordHash = await encrypt(body.password);
        body.password = newPasswordHash;
      } else {
        body.password = existingItem.password;
      }
    } else {
      delete body.password;
    }
    // Actualiza los atributos del registro encontrado
    await existingItem.update(body);

    res.send({ data: existingItem });
  } catch (error) {
    console.log(error);
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

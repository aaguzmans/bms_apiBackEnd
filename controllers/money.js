const { matchedData } = require("express-validator");
const { moneyModel } = require("../models");
const { handleHttpError } = require("../utils/handleError");
const sequelizePaginate = require('sequelize-paginate');
const axios = require('axios');

const getItems = async (req, res) => {
  try {

    //para saber quien es la persona que esta consumiendo la peticion, la llamamos por medio de los datos de la sesion
    const user = req.user;

    // Obtener el ID de la compañía asociada al usuario
    //const companyId = user.companyId;

    const { page, per_page } = req.query; // Obtén los parámetros de paginación
    const pageSize = Math.max(parseInt(per_page), 8); // Asegúrate de que per_page sea al menos 8

    const { docs, pages, total } = await moneyModel.paginate({
      page: parseInt(page), // Convierte a número entero
      paginate: pageSize, // Establece el tamaño de la página
    });

    res.send({ data: docs, user, pages, total, per_page: pageSize }); // Agrega el campo per_page a la respuesta
  } catch (error) {
    console.log(error)
    handleHttpError(res, "ERROR_GET_ITEMS");
  }
};

const getItem = async (req, res) => {
  try {
    //para saber quien es la persona que esta consumiendo la peticion, la llamamos por medio de los datos de la sesion
    const user = req.user;

    // Obtener el ID de la compañía asociada al usuario
    //const companyId = user.companyId;

    req = matchedData(req);
    const { id } = req;
    // Consulta el registro por su clave primaria (id) y donde companyId coincida con user.companyId
    const data = await moneyModel.findOne({
      where: {
        id
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
    //const companyId = user.companyId;

    const body = matchedData(req);

    // Asignar companyId al campo companyId del body
    //body.companyId = companyId;

    const data = await moneyModel.create(body);
    res.send({ data, user });
  } catch (error) {
    handleHttpError(res, "ERROR_CREATE_ITEMS");
  }
};

const updateItem = async (req, res) => {
  try {
    const { id, ...body } = matchedData(req);
    // const data = await moneyModel.findOneAndUpdate( id, body );
    // res.send({ data });

    // Find the record by its primary key (id)
    const existingItem = await moneyModel.findByPk(id);

    if (!existingItem) {
      handleErrorResponse(res, "ITEM_NOT_FOUND", 404);
      return;
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
    const existingItem = await moneyModel.findByPk(id);

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

const getExchangeRate = async (req, res) => {
  try {
    const { base, target } = req.params;
    const response = await axios.get(`https://open.er-api.com/v6/latest/${base}`);
    const exchangeRate = response.data.rates[target];
    res.json({ exchangeRate });
  } catch (error) {
    console.error('Error al obtener la tasa de cambio:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { getItems, getItem, createItem, updateItem, deleteItem, getExchangeRate };

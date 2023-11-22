const { matchedData } = require("express-validator");
const { Op } = require("sequelize");
const { appointmentScheduleModel, patientCaseModel, serviceModel, companyModel } = require("../models");
const { handleHttpError } = require("../utils/handleError");
const sequelizePaginate = require('sequelize-paginate');

const getItems = async (req, res) => {
  try {
    const user = req.user;
    const companyId = user.companyId;

    const { page, per_page, patientCaseName, appointmentDate, identityCard } = req.query;
    const pageSize = Math.max(parseInt(per_page), 8);

    const whereCondition = {
      companyId: companyId
    };

    const includeConditions = [
      {
        model: patientCaseModel,
        as: 'patientCase',
        where: {}
      },
      {
        model: serviceModel,
        as: 'service'
      },
      {
        model: companyModel,
        as: 'company'
      }
    ];

    if (patientCaseName) {
      includeConditions[0].where.patientCaseName = {
        [Op.like]: `%${patientCaseName}%`
      };
    }

    if (appointmentDate) {
      whereCondition.appointmentDate = {
        [Op.like]: `%${appointmentDate}%`
      };
    }

    if (identityCard) {
      includeConditions[0].identityCard = {
        [Op.like]: `%${identityCard}%`
      };
    }

    const { docs, pages, total } = await appointmentScheduleModel.paginate({
      where: whereCondition,
      page: parseInt(page),
      paginate: pageSize,
      include: includeConditions
    });

    res.send({ data: docs, user, pages, total, per_page: pageSize });
  } catch (error) {
    console.log(error);
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
    const data = await appointmentScheduleModel.findOne({
      where: {
        id,
        companyId: companyId
      }
    });

    res.send({ data, user });
  } catch (error) {
    console.log(error)
    handleHttpError(res, "ERROR_GET_ITEM");
  }
};

const getItemsByPatientId = async (req, res) => {
  try {
    req = matchedData(req);
    const { patientId } = req; // Obtén los parámetros de paginación y el patientId
    const pageSize = Math.max(parseInt(8)); // Asegúrate de que per_page sea al menos 8

    // Puedes ajustar esta parte según la estructura de tus modelos y relaciones
    const { docs, pages, total } = await appointmentScheduleModel.paginate({
      where: {
        patientId: patientId // Filtrar por el patientId proporcionado
      },
      page: parseInt(1),
      paginate: pageSize,
      include: [
        {
          model: patientCaseModel,
          as: 'patientCase'
        },
        {
          model: serviceModel,
          as: 'service'
        },
        {
          model: companyModel,
          as: 'company'
        }
      ]
    });

    res.send({ data: docs, pages, total, per_page: pageSize });
  } catch (error) {
    console.log(error);
    handleHttpError(res, "ERROR_GET_ITEMS");
  }
};

const createItem = async (req, res) => {
  try {
    //para saber quien es la persona que esta consumiendo la peticion, la llamamos por medio de los datos de la sesion
    const user = req.user;

    // Obtener el ID de la compañía asociada al usuario
    const companyId = user.companyId;
    
    const body = matchedData(req);
    
    // Asignar companyId al campo companyId del body
    body.companyId = companyId;

    const data = await appointmentScheduleModel.create(body);
    res.send({ data, user });
  } catch (error) {
    console.log(error)
    handleHttpError(res, "ERROR_CREATE_ITEMS");
  }
};

const updateItem = async (req, res) => {
  try {
    const { id, ...body } = matchedData(req);

    const existingItem = await appointmentScheduleModel.findByPk(id);

    if (!existingItem) {
      handleErrorResponse(res, "ITEM_NOT_FOUND", 404);
      return;
    }

    // Update the attributes of the found record
    await existingItem.update(body);

    res.send({ data: existingItem });
  } catch (error) {
    console.log(error)
    handleHttpError(res, "ERROR_UPDATE_ITEMS");
  }
};

const deleteItem = async (req, res) => {
  try {
    const { id } = matchedData(req);

    // Encuentra el registro que deseas marcar como eliminado
    const existingItem = await appointmentScheduleModel.findByPk(id);

    if (!existingItem) {
      handleErrorResponse(res, "ITEM_NOT_FOUND", 404);
      return;
    }

    // Marca el registro como eliminado (soft delete) en el campo DeletedAt con la fecha de "eliminacion"
    await existingItem.destroy();

    res.send({ data: existingItem });
  } catch (error) {
    console.log(error)
    handleHttpError(res, "ERROR_DELETE_ITEM");
  }
};


module.exports = { getItems, getItem, getItemsByPatientId, createItem, updateItem, deleteItem };

const { matchedData } = require("express-validator");
const {
  invoiceModel,
  patientCaseModel,
  serviceModel,
  moneyModel,
  companyModel,
  serviceinventoryModel,
  inventoryModel,
} = require("../models");
const { handleHttpError } = require("../utils/handleError");
const sequelizePaginate = require("sequelize-paginate");
const nodemailer = require('nodemailer');
const { sub } = require("date-fns");

const getItems = async (req, res) => {
  try {
    //para saber quien es la persona que esta consumiendo la peticion, la llamamos por medio de los datos de la sesion
    const user = req.user;

    // Obtener el ID de la compañía asociada al usuario
    const companyId = user.companyId;

    const { page, per_page } = req.query; // Obtén los parámetros de paginación
    const pageSize = Math.max(parseInt(per_page), 8); // Asegúrate de que per_page sea al menos 8

    const { docs, pages, total } = await invoiceModel.paginate({
      where: {
        companyId: companyId,
      },
      page: parseInt(page), // Convierte a número entero
      paginate: pageSize, // Establece el tamaño de la página
      include: [
        {
          model: patientCaseModel,
          as: "patientCase",
          attributes: ["id", "patientName", "lastName", "lastName2"],
        },
        {
          model: serviceModel, // Suponiendo que tienes un modelo llamado "Service" configurado
          as: "service", // El nombre de la relación en el modelo "PatientCase"
          attributes: ["id", "serviceName"], // Define los atributos del servicio que deseas incluir
        },
        {
          model: moneyModel,
          as: "money",
          attributes: ["id", "moneyName"],
        },
        {
          model: companyModel, // Suponiendo que tienes un modelo llamado "Service" configurado
          as: "company", // El nombre de la relación en el modelo "PatientCase"
          attributes: ["id", "companyName"], // Define los atributos del servicio que deseas incluir
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
    const data = await invoiceModel.findOne({
      where: {
        id,
        companyId: companyId,
      },
    });

    res.send({ data, user });
  } catch (error) {
    handleHttpError(res, "ERROR_GET_ITEM");
  }
};

const sendEmail = async (req, res) => {

  const pdfBuffer = req.file.buffer;

  const { from, senderEmailPass, to, subject, text, pdf } = req.body;
  
  if (!from || !to || !subject || !text || !pdf) {
    console.log("Faltan parámetros requeridos")
    //return res.send({ success: false, message: 'Faltan parámetros requeridos' });
  }
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: from,
        pass: senderEmailPass, 
      },
    });

    const mailOptions = {
      from,
      to,
      subject,
      text,
      attachments: [
        {
          filename: `${subject}.pdf`,
          content: pdfBuffer,
          encoding: "base64",
        },
      ],
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Correo electrónico enviado:', result);
    res.send({ success: true, message: 'Correo electrónico enviado con éxito' });
  } catch (error) {
    console.error('Error al enviar el correo electrónico:', error);
    handleHttpError(res, "ERROR_SEND_INVOICE");
  }
}

const createItem = async (req, res) => {
  try {
    const user = req.user;
    const companyId = user.companyId;
    const body = matchedData(req);
    body.companyId = companyId;

    const data = await invoiceModel.create(body);

    // Obtener información del serviceinventory mediante serviceId
    const serviceInventoryServiceId = body.serviceId;
    const serviceInventoryS = await serviceinventoryModel.findOne({
      where: { serviceId: serviceInventoryServiceId },
    });

    // Obtener la cantidad de serviceinventory
    const serviceInventoryQuantity = serviceInventoryS.quantity;

    // Obtener información del serviceinventory mediante inventoryId
    const serviceInventoryInventoryId = serviceInventoryS.inventoryId; // Asegúrate de tener el campo correcto aquí
    const serviceInventoryI = await serviceinventoryModel.findOne({
      where: { inventoryId: serviceInventoryInventoryId }
    });

    // Actualizar la cantidad en inventory
    const inventoryId = serviceInventoryI.inventoryId;
    const inventory = await inventoryModel.findByPk(inventoryId);
    if (inventory) {
      const newInventoryQuantity = inventory.quantity - serviceInventoryQuantity;
      await inventory.update({ quantity: newInventoryQuantity });
    }

    res.send({ data, user });
  } catch (error) {
    console.log(error);
    handleHttpError(res, "ERROR_CREATE_ITEMS");
  }
};

const updateItem = async (req, res) => {
  try {
    const { id, ...body } = matchedData(req);
    // const data = await invoiceModel.findOneAndUpdate( id, body );
    // res.send({ data });

    // Find the record by its primary key (id)
    const existingItem = await invoiceModel.findByPk(id);

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
    const existingItem = await invoiceModel.findByPk(id);

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

module.exports = { getItems, getItem, sendEmail, createItem, updateItem, deleteItem };

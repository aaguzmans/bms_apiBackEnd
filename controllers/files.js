const { matchedData } = require("express-validator");
const { filesModel } = require("../models");
const { handleHttpError } = require("../utils/handleError");
const fs = require("fs");

const getItems = async (req, res) => {
  try {
    const companyId = req.user.companyId;

    const data = await filesModel.findAll({
      where: {
        companyId,
      },
    });

    const dataWithBase64File = data.map((file) => {
      const base64File = file.file.toString('base64');
      return {
        id: file.id,
        companyId: file.companyId,
        fileName: file.fileName,
        fileType: file.fileType,
        file: base64File,
      };
    });

    res.send({ data: dataWithBase64File });
  } catch (error) {
    console.error(error);
    handleHttpError(res, "ERROR_GET_FILES");
  }
};

const getItem = async (req, res) => {
  try {
    const { id } = matchedData(req);

    const file = await filesModel.findOne({
      where: { id },
    });

    if (!file) {
      return handleHttpError(res, "FILE_NOT_FOUND", 404);
    }

    res.send({
      file: file.file,
      fileName: file.fileName,
      fileType: file.fileType,
      user: req.user,
    });
  } catch (error) {
    return handleHttpError(res, "ERROR_GET_FILE");
  }
};

const createItem = async (req, res) => {
  try {
    const user = req.user;
    const companyId = user.companyId;
    const uploadedFile = req.file;

    if (!uploadedFile) {
      return res
        .status(400)
        .json({ error: "No se proporcionó ningún archivo" });
    }

    // Convierte el buffer hexadecimal a binario
    const binaryBuffer = Buffer.from(uploadedFile.buffer, 'hex');

    // Luego, convierte el buffer binario a base64
    const base64File = binaryBuffer.toString("base64");

    const fileData = {
      companyId: companyId,
      file: base64File,
      fileName: uploadedFile.originalname,
      fileType: uploadedFile.mimetype,
    };

    await filesModel.create(fileData);

    res.send({ data: fileData, user });
  } catch (error) {
    console.log(error);
    handleHttpError(res, "ERROR_CREATE_FILE");
  }
};

const updateItem = async (req, res) => {
  try {
    const { id, ...body } = matchedData(req);

    const existingFile = await filesModel.findOne({
      where: {
        id,
        companyId: req.user.companyId,
      },
    });

    if (!existingFile) {
      handleHttpError(res, "FILE_NOT_FOUND", 404);
      return;
    }

    const base64File = req.file.buffer.toString("base64");

    body.file = base64File;

    await existingFile.update(body);

    res.send({ data: existingFile });
  } catch (error) {
    handleHttpError(res, "ERROR_UPDATE_FILE");
  }
};

const deleteItem = async (req, res) => {
  try {
    const { id } = matchedData(req);

    const existingFile = await filesModel.findOne({
      where: {
        id,
        companyId: req.user.companyId,
      },
    });

    if (!existingFile) {
      handleHttpError(res, "FILE_NOT_FOUND", 404);
      return;
    }

    await existingFile.destroy();

    res.send({ data: existingFile });
  } catch (error) {
    handleHttpError(res, "ERROR_DELETE_FILE");
  }
};

module.exports = { getItems, getItem, createItem, updateItem, deleteItem };

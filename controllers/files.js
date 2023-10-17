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

    // Mapear los datos y convertir el campo 'file' a base64
    const dataWithBase64File = data.map((file) => {
      const base64File = Buffer.from(file.file).toString("base64");
      return {
        id: file.id,
        companyId: file.companyId,
        fileName: file.fileName,
        fileType: file.fileType,
        file: base64File, // Convierte 'file' a base64
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

    // Convierte el campo 'file' a base64
    const base64File = Buffer.from(file.file).toString("base64");

    res.send({
      file: base64File,
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
    //const companyId = user.companyId;
    console.log(req)
    const uploadedFile = req.file;
    //const fileName = uploadedFile.originalname;
    console.log(uploadedFile)
    if (!uploadedFile) {
      return res
        .status(400)
        .json({ error: "No se proporcionó ningún archivo" });
    }

    //const fileName = req.body.fileName;
    //const fileType = req.body.fileType;

    //const fileData = {
      //companyId: companyId,
      //file: uploadedFile.buffer,
      //fileName: fileName,
      //fileType: fileType,
    //};

    console.log("uno");
    console.log(uploadedFile);
    console.log("dos");
    //console.log(fileName);

    //res.send({ data: fileData, user });
  } catch (error) {
    console.error(error);
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

    // Recuerda que Multer ya ha procesado y almacenado el archivo en req.file
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

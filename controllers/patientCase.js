const { matchedData } = require("express-validator");
const {
  patientCaseModel,
  identityCardModel,
  genderModel,
  countryModel,
  patientHistoryModel,
  treatmentModel,
  diseaseModel,
  serviceModel,
  appointmentScheduleModel,
} = require("../models");
const { handleHttpError } = require("../utils/handleError");

const getItems = async (req, res) => {
  try {
    const user = req.user;
    const companyId = user.companyId;

    const { page, per_page } = req.query;
    const pageSize = Math.max(parseInt(per_page), 8);

    const { docs, pages, total } = await patientCaseModel.paginate({
      where: { companyId },
      page: parseInt(page),
      paginate: pageSize,
      include: [
        {
          model: serviceModel,
          as: "service",
        },
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
          model: patientHistoryModel,
          as: "patientHistory",
        },
        {
          model: treatmentModel,
          as: "treatment",
        },
        {
          model: diseaseModel,
          as: "disease",
        },
      ],
    });

    res.send({ data: docs, user, pages, total, per_page: pageSize });
  } catch (error) {
    handleHttpError(res, "ERROR_GET_ITEMS");
  }
};

const getItem = async (req, res) => {
  try {
    const user = req.user;
    const companyId = user.companyId;

    const { id } = matchedData(req);
    const data = await patientCaseModel.findOne({
      where: { id, companyId },
    });

    res.send({ data, user });
  } catch (error) {
    handleHttpError(res, "ERROR_GET_ITEM");
  }
};

const createItem = async (req, res) => {
  try {
    const user = req.user;
    const companyId = user.companyId;

    // Crear los registros relacionados y asignar companyId
    req.body.patientHistory.companyId = companyId;
    req.body.treatment.companyId = companyId;
    req.body.disease.companyId = companyId;

    const [patientHistory, treatment, disease] = await Promise.all([
      patientHistoryModel.create(req.body.patientHistory),
      treatmentModel.create(req.body.treatment),
      diseaseModel.create(req.body.disease),
    ]);

    if (!patientHistory || !treatment || !disease) {
      throw new Error("Error al crear registros relacionados.");
    }

    const getLatestRecord = async (model, companyId) => {
      return model.findOne({
        where: { companyId: companyId },
        order: [["createdAt", "DESC"]],
      });
    };

    const [
      latestPatientHistory,
      latestTreatment,
      latestDisease,
    ] = await Promise.all([
      getLatestRecord(patientHistoryModel, companyId),
      getLatestRecord(treatmentModel, companyId),
      getLatestRecord(diseaseModel, companyId),
    ]);

    if (!latestPatientHistory || !latestTreatment || !latestDisease) {
      throw new Error("No se pudieron encontrar los registros más recientes.");
    }

    const { id: PatientHistoryId } = latestPatientHistory;
    const { id: TreatmentId } = latestTreatment;
    const { id: DiseaseId } = latestDisease;

    const {
      countryId,
      patientCaseName,
      lastName,
      lastName2,
      identityCardTypeId,
      identityCard,
      genderId,
      profession,
      dateOfBirth,
      phoneNumber,
      phoneNumber2,
      city,
      address,
      email,
      serviceId,
    } = req.body.patientCase;

    const patientCaseData = {
      countryId,
      patientCaseName,
      lastName,
      lastName2,
      identityCardTypeId,
      identityCard,
      genderId,
      profession,
      dateOfBirth,
      phoneNumber,
      phoneNumber2,
      city,
      address,
      email,
      serviceId,
      patientHistoryId: PatientHistoryId,
      treatmentId: TreatmentId,
      diseaseId: DiseaseId,
      companyId,
    };

    const data = await patientCaseModel.create(patientCaseData);

    const latestPatientCase = await getLatestRecord(patientCaseModel, companyId);

    if (!latestPatientCase) {
      throw new Error("No se pudo encontrar el registro más reciente del paciente.");
    }

    const { id: PatientCaseId } = latestPatientCase;

    const appointmentScheduleData = {
      companyId,
      patientId: PatientCaseId,
      serviceId: serviceId,
      appointmentDate: new Date(), // Establecer la fecha actual
      appointmentNotes: "",
    };

    await appointmentScheduleModel.create(appointmentScheduleData);

    res.send({ data, user });
  } catch (error) {
    console.log(error);
    handleHttpError(res, "ERROR_CREATE_ITEMS");
  }
};

const updateItem = async (req, res) => {
  try {
    const { id } = req.params; //Obtengo el id de patientCase

    const patientCaseData = {
      patientCaseName: req.body.patientCase.patientCaseName,
      lastName: req.body.patientCase.lastName,
      lastName2: req.body.patientCase.lastName2,
      identityCardTypeId: req.body.patientCase.identityCardTypeId,
      identityCard: req.body.patientCase.identityCard,
      genderId: req.body.patientCase.genderId,
      profession: req.body.patientCase.profession,
      dateOfBirth: req.body.patientCase.dateOfBirth,
      phoneNumber: req.body.patientCase.phoneNumber,
      phoneNumber2: req.body.patientCase.phoneNumber2,
      countryId: req.body.patientCase.countryId,
      city: req.body.patientCase.city,
      address: req.body.patientCase.address,
      email: req.body.patientCase.email,
      serviceId: req.body.patientCase.serviceId,
      patientHistoryId: req.body.patientCase.patientHistoryId,
      treatmentId: req.body.patientCase.treatmentId,
      diseaseId: req.body.patientCase.diseaseId,
    };

    const patientHistoryId = req.body.patientCase.patientHistoryId;

    const patientHistoryData = {
      id: patientHistoryId,
      alcoholConsumption: req.body.patientHistory.alcoholConsumption,
      smokingHabit: req.body.patientHistory.smokingHabit,
      drugsUse: req.body.patientHistory.drugsUse,
      foodAllergies: req.body.patientHistory.foodAllergies,
    };

    const treatmentId = req.body.patientCase.treatmentId;

    const treatmentData = {
      id: treatmentId,
      treatmentName: req.body.treatment.treatmentName,
      dose: req.body.treatment.dose,
      frequency: req.body.treatment.frequency,
      startDate: req.body.treatment.startDate,
      endDate: req.body.treatment.endDate,
    };

    const diseaseId = req.body.patientCase.diseaseId;

    const diseaseData = {
      id: diseaseId,
      diseaseName: req.body.disease.diseaseName,
    };

    // Encuentra el registro existente por su ID
    const existingItem = await patientCaseModel.findByPk(id);

    if (!existingItem) {
      handleErrorResponse(res, "ITEM_NOT_FOUND", 404);
      return;
    }

    // Actualiza los atributos del registro existente con los datos del cuerpo de la solicitud
    await existingItem.update(patientCaseData);

    // Actualiza las tablas relacionadas (patientHistory, treatment, disease)
    await patientHistoryModel.update(patientHistoryData, {
      where: { id: patientHistoryData.id },
    });
    await treatmentModel.update(treatmentData, {
      where: { id: treatmentData.id },
    });
    await diseaseModel.update(diseaseData, {
      where: { id: diseaseData.id },
    });

    // Recarga el registro actualizado para obtener los datos actualizados
    const updatedItem = await patientCaseModel.findByPk(id, {
      include: [
        {
          model: patientHistoryModel,
          as: "patientHistory",
        },
        {
          model: treatmentModel,
          as: "treatment",
        },
        {
          model: diseaseModel,
          as: "disease",
        },
      ],
    });

    res.send({ data: updatedItem });
  } catch (error) {
    console.log(error);
    handleHttpError(res, "ERROR_UPDATE_ITEMS");
  }
};

const deleteItem = async (req, res) => {
  try {
    const { id } = matchedData(req);

    // Encuentra el registro que deseas marcar como eliminado
    const existingItem = await patientCaseModel.findByPk(id);
    console.log(existingItem);

    if (!existingItem) {
      handleErrorResponse(res, "ITEM_NOT_FOUND", 404);
      return;
    }

    const patientHistoryId = existingItem.patientHistoryId;
    const treatmentId = existingItem.treatmentId;
    const diseaseId = existingItem.diseaseId;

    const existingpatientHistoryItem = await patientHistoryModel.findByPk(
      patientHistoryId
    );
    const existingtreatmentItem = await treatmentModel.findByPk(treatmentId);
    const existingdiseaseItem = await diseaseModel.findByPk(diseaseId);

    // Marca el registro como eliminado (soft delete) en el campo DeletedAt con la fecha de "eliminacion"
    await existingItem.destroy();
    await existingpatientHistoryItem.destroy();
    await existingtreatmentItem.destroy();
    await existingdiseaseItem.destroy();

    res.send({ data: existingItem });
  } catch (error) {
    console.log(error);
    handleHttpError(res, "ERROR_DELETE_ITEM");
  }
};

module.exports = { getItems, getItem, createItem, updateItem, deleteItem };

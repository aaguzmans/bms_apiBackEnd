const models = {
    appointmentScheduleModel: require('./mysql/appointmentSchedule'),
    companyModel: require('./mysql/company'),
    countryModel: require('./mysql/country'),
    diseaseModel: require('./mysql/disease'),
    genderModel: require('./mysql/gender'),
    identityCardModel: require('./mysql/identityCard'),
    inventoryModel: require('./mysql/inventory'),
    invoiceModel: require('./mysql/invoice'),
    measurementModel: require('./mysql/measurement'),
    moneyModel: require('./mysql/money'),
    patientCase: require('./mysql/patientCase'),
    patientHistory: require('./mysql/patientHistory'),
    service: require('./mysql/service'),
    serviceinventory: require('./mysql/serviceinventory'),
    supplierModel: require('./mysql/supplier'),
    treatmentModel: require('./mysql/treatment'),
    userModel: require('./mysql/users'),
}

module.exports = models
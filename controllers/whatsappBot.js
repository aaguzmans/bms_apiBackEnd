const venom = require("venom-bot");
const { format } = require("date-fns");
const {
  sessionModel,
  appointmentScheduleModel,
  patientCaseModel,
  serviceModel,
  companyModel,
} = require("../models");

let client;
let userData = "";
let browser;

// Función para iniciar el cliente de WhatsApp
const startWhatsAppBot = async (user) => {
  try {
    // Verificar si ya existe un cliente y un navegador en ejecución
    if (client && browser) {
      return client;
    }
    userData = user;
    //headless false muestra el navegador, headless true lo oculta
    client = await venom.create({
      session: `session-${userData.id}`,
      headless: false, //esto usando nodemon, reinicia el servidor despues de mostrar un qr, ejecutar sin nodemon funciona bien
      browserArgs: ['--no-sandbox', '--disable-setuid-sandbox', '--user-data-dir=/tmp'],
    });

    client.onStateChange(async (state) => {
      if (state === "CONNECTED") {
        const existingSession = await sessionModel.findOne({
          where: { email: userData.email },
        });

        if (!existingSession) {
          await sessionModel.create({
            sessionId: client.session,
            email: userData.email,
            sessionState: state,
          });
        } else {
          await sessionModel.update(
            { sessionState: "CONNECTED" },
            { where: { email: userData.email } }
          );
        }

        sendMessageRoute();
      }
    });

    // Obtener la instancia del navegador para mantenerla abierta
    browser = await client.browserInstance;

    return client;
  } catch (error) {
    console.error("Error al iniciar WhatsApp Bot:", error);
    throw error;
  }
};

const getItemsForTomorrow = async () => {
  try {
    const companyId = userData.companyId;

    const now = new Date();

    const twentyFourHoursLater = new Date(now);
    twentyFourHoursLater.setHours(now.getHours() + 24);

    const whereCondition = {
      companyId: companyId,
    };

    const includeConditions = [
      {
        model: patientCaseModel,
        as: "patientCase",
      },
      {
        model: serviceModel,
        as: "service",
      },
      {
        model: companyModel,
        as: "company",
      },
    ];

    const { docs } = await appointmentScheduleModel.paginate({
      where: whereCondition,
      paginate: 100,
      include: includeConditions,
    });

    return docs;
  } catch (error) {
    throw error;
  }
};

const sendMessageRoute = async () => {
  try {
    const appointments = await getItemsForTomorrow();

    for (const appointment of appointments) {
      /*los numeros de telefono deben tener el forma 50660682435
      todo el numero de telefono completo y el codigo de pais*/
      const phoneNumber = appointment.patientCase.phoneNumber;
      // Ajustar la diferencia horaria de la cita
      const adjustedAppointmentDate = new Date(appointment.appointmentDate);
      //const formattedDate = format(adjustedAppointmentDate,"dd/MM/yyyy hh:mm a",{ timeZone: "America/New_York" } // Reemplaza "America/New_York" con tu zona horaria);
      adjustedAppointmentDate.setHours(adjustedAppointmentDate.getHours()); // adjustedAppointmentDate.setHours(adjustedAppointmentDate.getHours() - 6); habia que poner -6 para reducir las 6 horas de diferencia del servidor

      // Verificar si la cita es dentro de las próximas 24 horas
      const twentyFourHoursLater = new Date();
      twentyFourHoursLater.setHours(twentyFourHoursLater.getHours() + 24);

      if (
        adjustedAppointmentDate > new Date() &&
        adjustedAppointmentDate <= twentyFourHoursLater
      ) {
        const formattedDate = format(
          adjustedAppointmentDate,
          "dd/MM/yyyy hh:mm a"
        );

        // Verificar si el mensaje ya fue enviado previamente
        const messageSent = await appointmentScheduleModel.findOne({
          where: {
            id: appointment.id,
            isMessageSent: true,
          },
        });

        if (!messageSent) {
          // si messageSent es false entonces procede a enviar el mensaje
          const message = `Se le recuerda su cita para el dia: ${formattedDate}`;
          try {
            await sendAutoMessage(phoneNumber, message);

            await appointmentScheduleModel.update(
              { isMessageSent: true },
              { where: { id: appointment.id } }
            );

            console.log("Mensaje enviado");
          } catch (error) {
            console.error("Error al enviar el mensaje programado:", error);
          }
        } else {
          console.log("El mensaje ya fue enviado");
        }
      }
    }
    //await client.close(); //se cierra la sesion para no causar conflictos

    await sessionModel.update(
      { sessionState: "DISCONNECTED" },
      { where: { email: userData.email } }
    );
  } catch (error) {
    console.log(error);
    console.log("Error en la operación");
  }
};

const sendAutoMessage = async (phoneNumber, message) => {
  try {
    const result = await client.sendText(`${phoneNumber}@c.us`, message);

    return result;
  } catch (error) {
    console.error("Error al enviar mensaje:", error);
    throw error;
  }
};

const GETQRCODE = async (req, res) => {
  try {
    startWhatsAppBot(req.user);

    res.send({
      message: "Generando QR Para Conectar el Dispositivo.",
      user: req.user,
    });
  } catch (error) {
    console.error("Error handling GETQRCODE:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

module.exports = {
  sendMessageRoute,
  startWhatsAppBot,
  GETQRCODE,
};

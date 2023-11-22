// Import necessary modules and classes
const {
  createBot,
  createProvider,
  createFlow,
  addKeyword,
} = require("@bot-whatsapp/bot");
const WebWhatsappProvider = require("@bot-whatsapp/provider/web-whatsapp");
const MockAdapter = require("@bot-whatsapp/database/mock");

const fs = require("fs").promises;
const path = require("path");
// Define your flows and keywords as before
// ...

const flowSecundario = addKeyword(["2", "siguiente"]).addAnswer([
  "📄 Aquí tenemos el flujo secundario",
]);

const flowDocs = addKeyword([
  "doc",
  "documentacion",
  "documentación",
]).addAnswer(
  [
    "📄 Aquí encontras las documentación recuerda que puedes mejorarla",
    "https://bot-whatsapp.netlify.app/",
    "\n*2* Para siguiente paso.",
  ],
  null,
  null,
  [flowSecundario]
);

const flowTuto = addKeyword(["tutorial", "tuto"]).addAnswer(
  [
    "🙌 Aquí encontras un ejemplo rapido",
    "https://bot-whatsapp.netlify.app/docs/example/",
    "\n*2* Para siguiente paso.",
  ],
  null,
  null,
  [flowSecundario]
);

const flowGracias = addKeyword(["gracias", "grac"]).addAnswer(
  [
    "🚀 Puedes aportar tu granito de arena a este proyecto",
    "[*opencollective*] https://opencollective.com/bot-whatsapp",
    "[*buymeacoffee*] https://www.buymeacoffee.com/leifermendez",
    "[*patreon*] https://www.patreon.com/leifermendez",
    "\n*2* Para siguiente paso.",
  ],
  null,
  null,
  [flowSecundario]
);

const flowDiscord = addKeyword(["discord"]).addAnswer(
  [
    "🤪 Únete al discord",
    "https://link.codigoencasa.com/DISCORD",
    "\n*2* Para siguiente paso.",
  ],
  null,
  null,
  [flowSecundario]
);

const flowPrincipal = addKeyword(["hola", "ole", "alo"])
  .addAnswer("🙌 Hola bienvenido a este *Chatbot*")
  .addAnswer(
    [
      "te comparto los siguientes links de interes sobre el proyecto",
      "👉 *doc* para ver la documentación",
      "👉 *gracias*  para ver la lista de videos",
      "👉 *discord* unirte al discord",
    ],
    null,
    null,
    [flowDocs, flowGracias, flowTuto, flowDiscord]
  );

// Define a function to initialize the bot
const initializeBot = async () => {
  const adapterDB = new MockAdapter();
  const adapterFlow = createFlow([flowPrincipal]);
  const adapterProvider = createProvider(WebWhatsappProvider);

  createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });

  // Optionally, you can include QR code generation logic here if needed
};

const whatsappBot = async (req, res) => {
  try {
    // Initialize the bot
    await initializeBot();

    // Optionally, you can handle incoming requests and interact with the bot
    // For example, you might handle incoming messages from users

    const imagePath = "../bms_apiBackEnd/bot.qr.png";

    console.log("Current working directory:", process.cwd());
    console.log("Resolved image path:", path.resolve(__dirname, imagePath));

    // Function to check if the file exists
    const fileExists = async (path) => {
      try {
        await fs.access(path);
        return true;
      } catch (error) {
        return false;
      }
    };

    // Check if the file exists with a timeout loop
    const maxAttempts = 10; // Adjust the number of attempts as needed
    let attempts = 0;
    while (attempts < maxAttempts) {
      if (await fileExists(imagePath)) {
        // Read the file if it exists
        const imageBuffer = await fs.readFile(imagePath);
        const base64Image = imageBuffer.toString("base64");

        // Respond with the base64 image or any other relevant data
        return res.status(200).json({
          message: "Bot initialized successfully.",
          image: base64Image,
        });
      } else {
        // Wait for a short period before checking again
        await new Promise((resolve) => setTimeout(resolve, 10000)); // Adjust the delay as needed
        attempts++;
      }
    }

    // If the file is not created after maxAttempts, respond with an error
    res.status(404).json({ error: "Image file not found after waiting." });
  } catch (error) {
    // Handle errors appropriately
    console.error("Error initializing bot:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Export the controller function for use in your API routes
module.exports = { whatsappBot };

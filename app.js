require("dotenv").config()
const express = require("express")
const cors = require("cors")
const { dbConnect } = require("./config/mysql")

const app = express()


// Configurar CORS para permitir solicitudes desde http://localhost:5173
const corsOptions = {
    origin: 'https://bms-cr-e88bb.web.app/', // Cambia esto al origen de tu frontend
    credentials: true, // Habilitar credenciales
  };

app.use(cors(corsOptions))
app.use(express.json({ limit: '50mb' })); 

const port = process.env.PORT || 3000

app.use("/api", require("./routes"));

app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})

dbConnect();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const { exec } = require("child_process");
const routes = require("./routes");

const app = express();
const BACKEND_PORT = 3000; // Puerto donde corre el backend
const FRONTEND_PORT = 5173; // Puerto del frontend

// Configuración de CORS para aceptar solicitudes desde el puerto del frontend
app.use(cors({
  origin: `http://localhost:${FRONTEND_PORT}`, // Permite el origen del frontend
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"], // Permite el encabezado Content-Type
}));

app.use(bodyParser.json());

// Rutas de la aplicación
app.use(routes);

// Configuración de carpeta estática para el frontend
app.use(express.static(path.join(__dirname, "..", "frontend")));

// Ruta que sirve el archivo HTML principal del frontend
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "..", "frontend", "index.html"));
});

// Inicia el servidor en el puerto especificado
app.listen(BACKEND_PORT, function () {
  console.log(`Servidor Express ejecutándose en http://127.0.0.1:${BACKEND_PORT}/`);
  exec(`open http://localhost:${FRONTEND_PORT}/`);
});

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.text({ limit: "10mb" }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

const PORT = process.env.PORT || 4000;
const PYTHON_API_URL = "http://localhost:5000/predict";

// Ruta para procesar imagenes de la camara
app.post("/api/imagen", async (req, res) => {
  let imagen = typeof req.body === 'string' ? req.body : req.body.imagen;
  
  if (imagen && imagen.startsWith("data:image")) {
    imagen = imagen.split(",")[1];
  }

  if (!imagen) {
    return res.status(400).json({ mensaje: "Sin imagen" });
  }

  try {
    // Llamamos al microservicio de IA (Flask)
    const response = await axios.post(PYTHON_API_URL, {
      image: imagen
    });

    const resultado = response.data;
    
    let mensaje = "";
    if (resultado.bache) mensaje += "Bache detectado. ";
    if (resultado.billete) mensaje += `Billete de ${resultado.billete} identificado. `;
    if (!resultado.bache && !resultado.billete) mensaje = "Camino despejado";

    res.json({
      detectado: resultado.bache,
      billete: resultado.billete,
      mensaje: mensaje,
      error: resultado.error || null
    });

  } catch (error) {
    console.error("Error conectando con el servidor de IA:", error.message);
    res.status(500).json({ 
      mensaje: "Servidor de IA no disponible", 
      detalle: error.message 
    });
  }
});

app.get("/", (req, res) => {
  res.send("Backend activo 🚀");
});

app.listen(PORT, () => {
  console.log(`Servidor en puerto ${PORT}`);
});
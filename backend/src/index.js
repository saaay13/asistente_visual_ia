import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { spawn } from "child_process";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

const PORT = process.env.PORT || 4000;

// Ruta para procesar imagenes de la camara
app.post("/api/imagen", (req, res) => {
  const { imagen } = req.body;

  if (!imagen) {
    return res.status(400).json({ mensaje: "Sin imagen" });
  }

  // Ejecuta script de IA combinada
  const pythonProcess = spawn('python', ['predict_combined.py']);

  let resultData = "";

  pythonProcess.stdin.write(imagen);
  pythonProcess.stdin.end();

  pythonProcess.stdout.on('data', (data) => {
    resultData += data.toString();
  });

  pythonProcess.on('close', (code) => {
    try {
      if (resultData) {
        const resultado = JSON.parse(resultData);
        
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
      } else {
        res.status(500).json({ mensaje: "Error IA" });
      }
    } catch (e) {
      console.error("Error JSON Python:", e);
      res.status(500).json({ mensaje: "Error interno IA" });
    }
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`Error Python: ${data}`);
  });
});

app.get("/", (req, res) => {
  res.send("Backend activo 🚀");
});

app.listen(PORT, () => {
  console.log(`Servidor en puerto ${PORT}`);
});
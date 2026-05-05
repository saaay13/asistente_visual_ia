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

app.post("/api/imagen", (req, res) => {
  const { imagen } = req.body;

  if (!imagen) {
    return res.status(400).json({ mensaje: "No se recibió imagen" });
  }

  // Llamar al script de Python combinado (Baches + Billetes)
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
        
        // Construimos el mensaje de respuesta basado en ambos modelos
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
        res.status(500).json({ mensaje: "Error en el procesamiento de IA" });
      }
    } catch (e) {
      console.error("Error parseando JSON de Python:", e);
      res.status(500).json({ mensaje: "Error interno del servidor de IA" });
    }
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`Error en Python: ${data}`);
  });
});

app.get("/", (req, res) => {
  res.send("Backend funcionando 🚀");
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
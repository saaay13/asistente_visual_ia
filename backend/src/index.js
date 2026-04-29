import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

const PORT = process.env.PORT || 4000;

app.post("/api/imagen", (req, res) => {
  const { imagen } = req.body;

  console.log("Imagen recibida");

  res.json({
    mensaje: "ok",
  });
});

app.get("/", (req, res) => {
  res.send("Backend funcionando 🚀");
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
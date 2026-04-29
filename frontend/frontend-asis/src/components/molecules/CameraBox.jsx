import { useEffect, useRef } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";

const CameraBox = () => {
  const videoRef = useRef(null);
  const modelRef = useRef(null);

  // 🔥 cargar modelo IA
  useEffect(() => {
    const cargarModelo = async () => {
      modelRef.current = await cocoSsd.load();
      console.log("Modelo cargado ✅");
    };

    cargarModelo();
  }, []);

  // 🎥 activar cámara
  useEffect(() => {
    const activarCamara = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      videoRef.current.srcObject = stream;
    };

    activarCamara();
  }, []);

  // 🧠 detectar objetos
  const detectar = async () => {
    if (!modelRef.current || !videoRef.current) {
      console.log("Modelo o video no listo");
      return;
    }

    const predicciones = await modelRef.current.detect(videoRef.current);

    console.log("Objetos detectados:", predicciones);

    if (predicciones.length > 0) {
      const objeto = predicciones[0].class;
      alert("Objeto detectado: " + objeto);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full rounded-xl"
      />

      <button
        onClick={detectar}
        className="bg-green-500 text-white px-4 py-2 rounded-xl"
      >
        Detectar objeto
      </button>
    </div>
  );
};

export default CameraBox;
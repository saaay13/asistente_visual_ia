import { useEffect, useRef } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";
import { interpretarObjeto } from "../../ia/reglas";
import { hablar } from "../../ia/voz";
const CameraBox = () => {
  const videoRef = useRef(null);
  const modelRef = useRef(null);

  useEffect(() => {
    const cargarModelo = async () => {
      modelRef.current = await cocoSsd.load();
      console.log("Modelo cargado ✅");
    };

    cargarModelo();
  }, []);

  useEffect(() => {
    const activarCamara = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        videoRef.current.srcObject = stream;
      } catch (error) {
        console.error("Error al acceder a la cámara:", error);
      }
    };

    activarCamara();
  }, []);
  const detectar = async () => {
    if (!modelRef.current || !videoRef.current) {
      console.log("Modelo o video no listo");
      return;
    }

    const predicciones = await modelRef.current.detect(videoRef.current);

    if (predicciones.length > 0) {
      const objeto = predicciones[0].class;

      const mensaje = interpretarObjeto(objeto);

      console.log("Interpretación:", mensaje);

      hablar(mensaje);
    } else {
      console.log("No se detectó ningún objeto conocido");
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
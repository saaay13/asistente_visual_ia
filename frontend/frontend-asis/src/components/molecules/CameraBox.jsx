import { useEffect, useRef, useState } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";
import { interpretarObjeto } from "../../ia/reglas";
import { hablar } from "../../ia/voz";

const CameraBox = () => {
  const videoRef = useRef(null);
  const modelRef = useRef(null);
  const [isAuto, setIsAuto] = useState(false);

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

  useEffect(() => {
    let interval;
    if (isAuto) {
      hablar("Asistencia automática iniciada. Escaneando el entorno.");
      interval = setInterval(() => {
        detectar();
      }, 3500);
    } else {
      // Si la apagamos, limpiamos el intervalo
      if (interval) clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isAuto]);

  const toggleAutoMode = () => {
    setIsAuto(!isAuto);
  };

  return (
    <div
      className="flex flex-col items-center gap-4 w-full h-full cursor-pointer"
      onClick={toggleAutoMode}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className={`w-full rounded-xl transition-all duration-300 ${isAuto ? 'border-4 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]' : 'border-4 border-transparent'}`}
      />

      <div className={`p-4 w-full text-center rounded-xl text-white text-xl font-bold transition-all duration-300 ${isAuto ? 'bg-green-600' : 'bg-gray-800'}`}>
        {isAuto ? "🛑 DETENER" : "INICIAR"}
      </div>
    </div>
  );
};

export default CameraBox;
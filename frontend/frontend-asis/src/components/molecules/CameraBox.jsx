import { useEffect, useRef, useState } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";
import { interpretarObjeto } from "../../ia/reglas";
import { hablar } from "../../ia/voz";
import { FeedbackBanner, StatusIndicator } from "../atoms";

const CameraBox = () => {
  const videoRef = useRef(null);
  const modelRef = useRef(null);
  const lastObjectRef = useRef(null);
  const lastSpeakTimeRef = useRef(0);
  const [isAuto, setIsAuto] = useState(false);
  const [isModelReady, setIsModelReady] = useState(false);

  useEffect(() => {
    const cargarModelo = async () => {
      modelRef.current = await cocoSsd.load();
      setIsModelReady(true);
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
      const ahora = Date.now();
      const tiempoPasado = ahora - lastSpeakTimeRef.current;

      // Solo hablar si el objeto es NUEVO, o si pasaron más de 10 segundos mirando el mismo objeto
      if (objeto !== lastObjectRef.current || tiempoPasado > 10000) {
        const mensaje = interpretarObjeto(objeto);
        console.log("Interpretación:", mensaje);
        hablar(mensaje);

        lastObjectRef.current = objeto;
        lastSpeakTimeRef.current = ahora;
      } else {
        console.log("Silencio: El mismo objeto sigue en frente.");
      }
    } else {
      console.log("No se detectó ningún objeto conocido");
      // Si no detecta nada, podemos borrar la memoria para que el siguiente objeto siempre lo hable
      lastObjectRef.current = null;
    }
  };

  useEffect(() => {
    let interval;
    if (isAuto) {
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
    if (!isAuto) {
      hablar("Iniciando asistencia. Escaneando el entorno.");
      setIsAuto(true);
    } else {
      hablar("Apagando asistencia. Detección detenida.");
      setIsAuto(false);
    }
  };

  return (
    <div
      className="relative flex flex-col items-center gap-4 w-full h-full cursor-pointer select-none"
      onDoubleClick={toggleAutoMode}
    >
      <StatusIndicator isReady={isModelReady} isAuto={isAuto} />
      
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className={`w-full rounded-xl transition-all duration-300 ${isAuto ? 'border-4 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]' : 'border-4 border-transparent'}`}
      />

      <FeedbackBanner isAuto={isAuto} />
    </div>
  );
};

export default CameraBox;
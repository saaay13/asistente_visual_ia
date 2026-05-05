import { useEffect, useRef, useState } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";
import { interpretarObjeto } from "../../ia/reglas";
import { hablar } from "../../ia/voz";
import { FeedbackBanner, StatusIndicator } from "../atoms";

const CameraBox = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const modelRef = useRef(null);
  const lastObjectRef = useRef(null);
  const lastSpeakTimeRef = useRef(0);
  const lastBacheTimeRef = useRef(0);

  // Modos: 'off', 'auto' (movilidad), 'bills' (billetera)
  const [mode, setMode] = useState('off');
  const [isModelReady, setIsModelReady] = useState(false);
  const clickTimer = useRef(null);
  const clickCount = useRef(0);

  // Usamos una referencia para el modo para evitar problemas de "stale state" en el intervalo
  const modeRef = useRef(mode);
  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  // Carga del modelo local
  useEffect(() => {
    const cargarModelo = async () => {
      try {
        modelRef.current = await cocoSsd.load();
        setIsModelReady(true);
        console.log("Modelo cargado ✅");
      } catch (e) {
        console.error("Error cargando modelo coco-ssd:", e);
      }
    };
    cargarModelo();
  }, []);

  // Camara
  useEffect(() => {
    const activarCamara = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
            width: { ideal: 640 },
            height: { ideal: 480 }
          },
        });
        videoRef.current.srcObject = stream;
      } catch (error) {
        console.error("Error camara:", error);
      }
    };
    activarCamara();
  }, []);

  // Envio al servidor segun modo
  const enviarABackend = async () => {
    if (!videoRef.current || !canvasRef.current || modeRef.current === 'off') return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    // Redimensionamos para que sea mas rapido (640px)
    canvas.width = 640;
    canvas.height = 480;
    context.drawImage(videoRef.current, 0, 0, 640, 480);

    const imagenBase64 = canvas.toDataURL("image/jpeg", 0.4); // Calidad baja para velocidad

    // Detectamos si estamos en la laptop o en el celular
    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    const backendURL = isLocal
      ? "http://localhost:4000/api/imagen"
      : "https://8305d61c05b11b.lhr.life/api/imagen";

    try {
      const response = await fetch(backendURL, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain"
        },
        body: imagenBase64,
      });

      const data = await response.json();
      const ahora = Date.now();

      // VALIDACION ESTRICTA DE MODO
      if (modeRef.current === 'auto' && data.detectado) {
        if (ahora - lastBacheTimeRef.current > 5000) {
          hablar("Cuidado, bache adelante");
          lastBacheTimeRef.current = ahora;
        }
      }
      else if (modeRef.current === 'bills' && data.billete) {
        if (data.billete !== lastObjectRef.current) {
          hablar(`Billete de ${data.billete}`);
          lastObjectRef.current = data.billete;
        }
      }
    } catch (error) {
      console.error("Error servidor IA:", error);
    }
  };

  // Deteccion continua
  const detectar = async () => {
    const currentMode = modeRef.current;
    if (!videoRef.current || currentMode === 'off') return;

    // Solo modo auto usa deteccion local (personas/objetos)
    if (currentMode === 'auto' && modelRef.current) {
      const predicciones = await modelRef.current.detect(videoRef.current);
      if (predicciones.length > 0) {
        const objeto = predicciones[0].class;
        const ahora = Date.now();
        if (objeto !== lastObjectRef.current || ahora - lastSpeakTimeRef.current > 10000) {
          hablar(interpretarObjeto(objeto));
          lastObjectRef.current = objeto;
          lastSpeakTimeRef.current = ahora;
        }
      }
    }

    // Llamamos al backend (el backend procesa segun lo que encuentre)
    enviarABackend();
  };

  // Intervalo de ejecucion: AHORA MAS RAPIDO (1 segundo)
  useEffect(() => {
    let interval;
    if (mode !== 'off') {
      interval = setInterval(detectar, 1000);
    }
    return () => clearInterval(interval);
  }, [mode]);

  // Manejador de toques (2 para auto, 3 para billetes)
  const handleTouch = () => {
    clickCount.current += 1;

    if (clickTimer.current) clearTimeout(clickTimer.current);

    clickTimer.current = setTimeout(() => {
      if (clickCount.current === 2) {
        const nextMode = mode === 'auto' ? 'off' : 'auto';
        setMode(nextMode);
        hablar(nextMode === 'auto' ? "Modo asistencia" : "Asistencia apagada");
      }
      else if (clickCount.current === 3) {
        const nextMode = mode === 'bills' ? 'off' : 'bills';
        setMode(nextMode);
        hablar(nextMode === 'bills' ? "Modo billetera" : "Billetera apagada");
      }
      clickCount.current = 0;
    }, 400); // Espera para ver si hay mas toques
  };

  return (
    <div
      className="relative flex flex-col items-center gap-4 w-full h-full cursor-pointer"
      onClick={handleTouch}
    >
      <StatusIndicator isReady={isModelReady} mode={mode} />

      <video
        ref={videoRef}
        autoPlay
        playsInline
        className={`w-full rounded-xl transition-all duration-300 ${mode === 'auto' ? 'border-4 border-green-500' :
            mode === 'bills' ? 'border-4 border-blue-500' : 'border-4 border-transparent'
          }`}
      />

      <canvas ref={canvasRef} className="hidden" />

      <FeedbackBanner mode={mode} />
    </div>
  );
};

export default CameraBox;
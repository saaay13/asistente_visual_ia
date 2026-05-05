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

  // Carga del modelo local
  useEffect(() => {
    const cargarModelo = async () => {
      modelRef.current = await cocoSsd.load();
      setIsModelReady(true);
      console.log("Modelo cargado ✅");
    };
    cargarModelo();
  }, []);

  // Camara
  useEffect(() => {
    const activarCamara = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
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
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const imagenBase64 = canvas.toDataURL("image/jpeg", 0.5);

    try {
      const response = await fetch("http://192.168.0.16:4000/api/imagen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imagen: imagenBase64 }),
      });

      const data = await response.json();
      const ahora = Date.now();

      // Logica segun el modo activo
      if (mode === 'auto' && data.detectado) {
        if (ahora - lastBacheTimeRef.current > 6000) {
          hablar("Cuidado, bache adelante");
          lastBacheTimeRef.current = ahora;
        }
      } 
      else if (mode === 'bills' && data.billete) {
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
    if (!modelRef.current || !videoRef.current || mode === 'off') return;

    // Solo modo auto usa deteccion local (personas/objetos)
    if (mode === 'auto') {
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

    // Ambos modos llaman al servidor (pero el servidor filtra por modo)
    enviarABackend();
  };

  // Intervalo de ejecucion
  useEffect(() => {
    let interval;
    if (mode !== 'off') {
      interval = setInterval(detectar, 3000);
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
        className={`w-full rounded-xl transition-all duration-300 ${
          mode === 'auto' ? 'border-4 border-green-500' : 
          mode === 'bills' ? 'border-4 border-blue-500' : 'border-4 border-transparent'
        }`}
      />

      <canvas ref={canvasRef} className="hidden" />

      <FeedbackBanner mode={mode} />
    </div>
  );
};

export default CameraBox;
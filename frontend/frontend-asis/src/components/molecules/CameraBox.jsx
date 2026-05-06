import { useEffect, useRef, useState } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";
import { interpretarObjeto } from "../../ia/reglas";
import { hablar } from "../../ia/voz";
import { TRANSLATIONS } from "../../ia/traducciones";
import { FeedbackBanner, StatusIndicator } from "../atoms";

const CameraBox = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const modelRef = useRef(null);
  const lastObjectRef = useRef(null);
  const lastSpeakTimeRef = useRef(0);
  const lastBacheTimeRef = useRef(0);

  const [mode, setMode] = useState('off');
  const [isModelReady, setIsModelReady] = useState(false);
  const clickTimer = useRef(null);
  const clickCount = useRef(0);

  const modeRef = useRef(mode);
  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    const cargarModelo = async () => {
      try {
        modelRef.current = await cocoSsd.load();
        setIsModelReady(true);
      } catch (e) {
        console.error("Error cargando modelo:", e);
      }
    };
    cargarModelo();
  }, []);

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

  const drawBoxes = (predicciones) => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    predicciones.forEach(pred => {
      const [x, y, width, height] = pred.bbox;
      const label = TRANSLATIONS[pred.class] || pred.class;

      // Estilo del cuadro
      ctx.strokeStyle = "#10b981"; // Esmeralda
      ctx.lineWidth = 4;
      ctx.setLineDash([]);
      ctx.strokeRect(x, y, width, height);

      // Fondo del texto
      ctx.fillStyle = "#10b981";
      const textWidth = ctx.measureText(label).width;
      ctx.fillRect(x, y - 30, textWidth + 20, 30);

      // Texto
      ctx.fillStyle = "white";
      ctx.font = "bold 18px Inter, system-ui";
      ctx.fillText(label, x + 10, y - 8);
    });
  };

  const enviarABackend = async () => {
    if (!videoRef.current || !canvasRef.current || modeRef.current === 'off') return;

    // Usamos un canvas temporal para el frame del backend para no ensuciar el de dibujo
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = 640;
    tempCanvas.height = 480;
    const ctx = tempCanvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, 640, 480);
    const imagenBase64 = tempCanvas.toDataURL("image/jpeg", 0.4);

    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    const backendURL = isLocal
      ? "http://localhost:4000/api/imagen"
      : "https://8305d61c05b11b.lhr.life/api/imagen";

    try {
      const response = await fetch(backendURL, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: imagenBase64,
      });

      const data = await response.json();
      const ahora = Date.now();

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

  const detectar = async () => {
    const currentMode = modeRef.current;
    if (!videoRef.current || !canvasRef.current || currentMode === 'off') return;

    if (currentMode === 'auto' && modelRef.current) {
      const predicciones = await modelRef.current.detect(videoRef.current);
      
      // Dibujar en el canvas principal
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      drawBoxes(predicciones);

      if (predicciones.length > 0) {
        const objeto = predicciones[0].class;
        const ahora = Date.now();
        if (objeto !== lastObjectRef.current || ahora - lastSpeakTimeRef.current > 10000) {
          hablar(interpretarObjeto(objeto));
          lastObjectRef.current = objeto;
          lastSpeakTimeRef.current = ahora;
        }
      }
    } else {
      // Limpiar canvas si no estamos en auto
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }

    enviarABackend();
  };

  useEffect(() => {
    let interval;
    if (mode !== 'off') {
      interval = setInterval(detectar, 1000);
    }
    return () => {
      clearInterval(interval);
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d");
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    };
  }, [mode]);

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
    }, 400);
  };

  return (
    <div
      className="relative flex flex-col items-center gap-4 w-full h-full cursor-pointer overflow-hidden"
      onClick={handleTouch}
    >
      <StatusIndicator isReady={isModelReady} mode={mode} />

      <div className="relative w-full h-[75vh] rounded-3xl overflow-hidden bg-black shadow-2xl border-4 border-white/10">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
            mode === 'auto' ? 'scale-105' : 'scale-100'
          }`}
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
      </div>

      <FeedbackBanner mode={mode} />
    </div>
  );
};

export default CameraBox;
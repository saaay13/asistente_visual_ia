import { useEffect, useRef } from "react";

const CameraBox = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const activarCamara = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        videoRef.current.srcObject = stream;
      } catch (error) {
        console.error("Error camara:", error);
      }
    };

    activarCamara();
  }, []);

  const capturarImagen = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    const imagen = canvas.toDataURL("image/png");

    enviarImagen(imagen);
  };


  const enviarImagen = async (imagen) => {
    try {
      const res = await fetch("http://localhost:4000/api/imagen", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imagen }),
      });

      const data = await res.json();
      console.log("Respuesta backend:", data);
    } catch (error) {
      console.error("Error envio:", error);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <video ref={videoRef} autoPlay className="w-full rounded-xl" />

      <button
        onClick={capturarImagen}
        className="bg-blue-500 text-white px-4 py-2 rounded-xl"
      >
        Capturar
      </button>
      

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default CameraBox;
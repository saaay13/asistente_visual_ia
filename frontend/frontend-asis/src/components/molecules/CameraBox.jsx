import { useRef, useEffect } from "react";

const CameraBox = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        videoRef.current.srcObject = stream;
      });
  }, []);

  return (
    <div className="p-4 border rounded-xl">
      <video ref={videoRef} autoPlay className="w-full rounded-xl" />
    </div>
  );
};

export default CameraBox;
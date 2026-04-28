import CameraBox from "../molecules/CameraBox";

const CameraSection = () => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold text-center">
        Camara activa
      </h2>

      <CameraBox />
    </div>
  );
};

export default CameraSection;
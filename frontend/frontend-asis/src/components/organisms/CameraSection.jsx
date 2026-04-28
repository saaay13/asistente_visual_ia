import CameraBox from "../molecules/CameraBox";

const CameraSection = () => {
  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-xl font-bold">Camara activa</h2>
      <CameraBox />
    </div>
  );
};

export default CameraSection;
const StatusIndicator = ({ isReady, isAuto }) => {
  let bgColor = "bg-yellow-500";
  if (isReady && !isAuto) bgColor = "bg-red-500";
  if (isReady && isAuto) bgColor = "bg-green-500";

  return (
    <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-full z-10">
      <div className={`w-3 h-3 rounded-full ${bgColor} ${isAuto ? 'animate-pulse' : ''}`}></div>
      <span className="text-white text-sm font-semibold">
        {!isReady ? "Cargando IA..." : isAuto ? "Escaneando" : "En pausa"}
      </span>
    </div>
  );
};

export default StatusIndicator;

const StatusIndicator = ({ isReady, mode }) => {
  const isOff = mode === 'off';
  let bgColor = "bg-yellow-500";
  
  // Color segun estado de carga y modo
  if (isReady) {
    if (mode === 'auto') bgColor = "bg-green-500";
    else if (mode === 'bills') bgColor = "bg-blue-500";
    else bgColor = "bg-red-500";
  }

  const getLabel = () => {
    if (!isReady) return "Cargando IA...";
    if (mode === 'auto') return "Escaneando entorno";
    if (mode === 'bills') return "Identificando billetes";
    return "En pausa";
  };

  return (
    <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-full z-10">
      <div className={`w-3 h-3 rounded-full ${bgColor} ${!isOff ? 'animate-pulse' : ''}`}></div>
      <span className="text-white text-sm font-semibold">
        {getLabel()}
      </span>
    </div>
  );
};

export default StatusIndicator;

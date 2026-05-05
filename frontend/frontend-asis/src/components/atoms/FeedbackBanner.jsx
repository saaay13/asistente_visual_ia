const FeedbackBanner = ({ mode }) => {
  // Color segun modo activo
  const getBannerStyle = () => {
    if (mode === 'auto') return 'bg-green-600';
    if (mode === 'bills') return 'bg-blue-600';
    return 'bg-gray-800';
  };

  // Texto informativo
  const getLabel = () => {
    if (mode === 'auto') return "MODO MOVILIDAD ACTIVO";
    if (mode === 'bills') return "MODO BILLETERA ACTIVO";
    return "DOBLE TOQUE PARA INICIAR";
  };

  return (
    <div className={`p-4 w-full text-center rounded-xl text-white text-xl font-bold transition-all duration-300 ${getBannerStyle()}`}>
      {getLabel()}
    </div>
  );
};

export default FeedbackBanner;

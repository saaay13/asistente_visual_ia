const FeedbackBanner = ({ isAuto }) => {
  return (
    <div className={`p-4 w-full text-center rounded-xl text-white text-xl font-bold transition-all duration-300 ${isAuto ? 'bg-green-600' : 'bg-gray-800'}`}>
      {isAuto ? "DETENER" : "INICIAR"}
    </div>
  );
};

export default FeedbackBanner;

export const hablar = (texto) => {
  if (!("speechSynthesis" in window)) {
    console.warn("Este navegador no soporta síntesis de voz");
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(texto);
  utterance.lang = "es-ES";
  utterance.rate = 1.0;
  utterance.pitch = 1.0;

  window.speechSynthesis.speak(utterance);
};

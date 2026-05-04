export const hablar = (texto) => {
  if (!("speechSynthesis" in window)) {
    console.warn("Este navegador no soporta síntesis de voz");
    return;
  }

  // Cancelar la voz anterior si sigue hablando
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(texto);
  utterance.lang = "es-ES"; // Español
  utterance.rate = 1.0; // Velocidad normal
  utterance.pitch = 1.0; // Tono normal

  window.speechSynthesis.speak(utterance);
};

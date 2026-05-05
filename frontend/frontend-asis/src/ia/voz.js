// Sintesis de voz con Web Speech API
export const hablar = (texto) => {
  if (!window.speechSynthesis) return;

  // Cancela locuciones previas
  window.speechSynthesis.cancel();

  const mensaje = new SpeechSynthesisUtterance(texto);
  mensaje.lang = "es-ES";
  mensaje.rate = 1.1; // Velocidad ligeramente rapida

  window.speechSynthesis.speak(mensaje);
};

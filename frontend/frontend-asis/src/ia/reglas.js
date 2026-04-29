export const interpretarObjeto = (objeto) => {
  if (objeto === "person") {
    return "Persona detectada cerca";
  }

  if (objeto === "cell phone") {
    return "Celular detectado";
  }

  if (objeto === "chair") {
    return "Silla enfrente, cuidado al avanzar";
  }

  if (objeto === "bottle") {
    return "Botella detectada";
  }

  return "Objeto detectado: " + objeto;
};
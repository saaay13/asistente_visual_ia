export const interpretarObjeto = (objeto) => {
  const reglas = {
    // 1. Peligros en Movimiento y Exteriores (Vehículos)
    car: "Precaución: Automóvil cerca. Detenga su paso si está cruzando.",
    truck: "Precaución: Vehículo pesado o camión cerca. Mantenga distancia.",
    bus: "Autobús detectado cerca de su posición.",
    motorcycle: "Precaución: Motocicleta cerca.",
    bicycle: "Bicicleta en el área. Cuidado con movimientos rápidos.",
    train: "Precaución: Tren o tranvía cercano.",
    airplane: "Avión detectado a lo lejos.",
    boat: "Embarcación o bote detectado.",

    // 2. Señalización y Mobiliario Urbano (Riesgo de choque/tropiezo)
    "traffic light": "Semáforo enfrente. Espere indicaciones sonoras para cruzar.",
    "fire hydrant": "Cuidado abajo: Hidrante de agua en la acera, evite tropezar.",
    "stop sign": "Señal de pare enfrente.",
    "parking meter": "Parquímetro enfrente, cuidado con golpearse.",
    bench: "Banca o asiento detectado cerca, puede descansar o esquivarlo.",

    // 3. Personas y Animales
    person: "Persona frente a usted.",
    dog: "Perro cerca, cuidado al pisar.",
    cat: "Gato cerca, cuidado al pisar.",
    bird: "Ave detectada.",
    horse: "Animal grande (caballo) cerca.",
    sheep: "Oveja cerca.",
    cow: "Vaca cerca.",
    elephant: "Elefante detectado.",
    bear: "Oso detectado.",
    zebra: "Cebra detectada.",
    giraffe: "Jirafa detectada.",

    // 4. Obstáculos en Interiores y Muebles Grandes
    chair: "Obstáculo frente a usted: Silla. Tenga cuidado al avanzar.",
    couch: "Sofá detectado, posible zona de descanso.",
    bed: "Cama detectada frente a usted.",
    "dining table": "Mesa enfrente, cuidado con los bordes.",
    "potted plant": "Obstáculo: Maceta o planta en su camino.",
    toilet: "Inodoro detectado (zona de baño).",
    tv: "Televisor o pantalla enfrente.",
    microwave: "Microondas cercano.",
    oven: "Horno cercano.",
    toaster: "Tostadora cercana.",
    sink: "Lavabo o fregadero cercano.",
    refrigerator: "Refrigerador cercano.",

    // 5. Riesgos de Tropiezo en el Suelo y Equipaje
    backpack: "Mochila o bulto en el camino, cuidado al pisar.",
    suitcase: "Maleta o equipaje en el suelo, riesgo de tropiezo.",
    handbag: "Bolso en el camino.",
    umbrella: "Paraguas detectado.",
    tie: "Corbata.",

    // 6. Tecnología y Escritorio
    laptop: "Computadora portátil cercana.",
    mouse: "Ratón de computadora.",
    keyboard: "Teclado.",
    "cell phone": "Teléfono celular.",
    remote: "Control remoto.",
    book: "Libro cercano.",
    clock: "Reloj.",
    scissors: "Tijeras, precaución, objeto punzocortante.",
    vase: "Jarrón o florero, cuidado con romperlo.",

    // 7. Deportes y Recreación (Riesgos de resbalón)
    skateboard: "Patineta en el suelo, alto riesgo de resbalón.",
    "sports ball": "Pelota en el suelo, riesgo de resbalón.",
    frisbee: "Disco volador o frisbee.",
    skis: "Esquís.",
    snowboard: "Tabla de snowboard.",
    kite: "Cometa.",
    "baseball bat": "Bate de béisbol.",
    "baseball glove": "Guante de béisbol.",
    surfboard: "Tabla de surf.",
    "tennis racket": "Raqueta de tenis.",

    // 8. Cocina, Comida y Otros
    bottle: "Botella detectada, posible basura en el camino.",
    "wine glass": "Copa de vidrio, cuidado con romperla.",
    cup: "Taza o vaso.",
    fork: "Tenedor.",
    knife: "Cuchillo, objeto punzocortante.",
    spoon: "Cuchara.",
    bowl: "Plato hondo o tazón.",
    banana: "Plátano (riesgo de resbalón si está en el suelo).",
    apple: "Manzana.",
    sandwich: "Sándwich.",
    orange: "Naranja.",
    broccoli: "Brócoli.",
    carrot: "Zanahoria.",
    "hot dog": "Perro caliente (comida).",
    pizza: "Pizza.",
    donut: "Dona.",
    cake: "Pastel.",
    "teddy bear": "Oso de peluche.",
    "hair drier": "Secadora de cabello.",
    toothbrush: "Cepillo de dientes."
  };

  if (reglas[objeto]) {
    return reglas[objeto];
  }

  // Fallback de seguridad (por si en un futuro cambian el modelo y detecta algo nuevo)
  return "Objeto detectado en su entorno.";
};
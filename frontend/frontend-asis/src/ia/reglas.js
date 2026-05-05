export const interpretarObjeto = (objeto) => {
  const reglas = {
    // 1. Peligros en movimiento y exteriores
    car: "Precaucion: Automovil cerca. Detenga su paso si esta cruzando.",
    truck: "Precaucion: Vehiculo pesado o camion cerca. Mantenga distancia.",
    bus: "Autobus detectado cerca de su posicion.",
    motorcycle: "Precaucion: Motocicleta cerca.",
    bicycle: "Bicicleta en el area. Cuidado con movimientos rapidos.",
    train: "Precaucion: Tren o tranvia cercano.",
    airplane: "Avion detectado a lo lejos.",
    boat: "Embarcacion o bote detectado.",

    // 2. Senalizacion y mobiliario urbano
    "traffic light": "Semaforo enfrente. Espere indicaciones sonoras para cruzar.",
    "fire hydrant": "Cuidado abajo: Hidrante de agua en la acera, evite tropezar.",
    "stop sign": "Senal de pare enfrente.",
    "traffic sign": "Senal de trafico.",
    "parking meter": "Parquimetro enfrente, cuidado con golpearse.",
    bench: "Banca o asiento detectado cerca, puede descansar o esquivarlo.",

    // 3. Personas y animales
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

    // 4. Obstaculos en interiores
    chair: "Obstaculo frente a usted: Silla. Tenga cuidado al avanzar.",
    couch: "Sofa detectado, posible zona de descanso.",
    bed: "Cama detectada frente a usted.",
    "dining table": "Mesa enfrente, cuidado con los bordes.",
    "potted plant": "Obstaculo: Maceta o planta en su camino.",
    toilet: "Inodoro detectado (zona de bano).",
    tv: "Televisor o pantalla enfrente.",
    laptop: "Computadora portatil cercana.",
    mouse: "Raton de computadora.",
    remote: "Control remoto.",
    keyboard: "Teclado.",
    "cell phone": "Telefono celular.",
    microwave: "Microondas cercano.",
    oven: "Horno cercano.",
    toaster: "Tostadora cercana.",
    sink: "Lavabo o fregadero cercano.",
    refrigerator: "Refrigerador cercano.",
    book: "Libro cercano.",
    clock: "Reloj.",
    vase: "Jaron o florero, cuidado con romperlo.",
    scissors: "Tijeras, precaucion, objeto punzocortante.",
    "teddy bear": "Oso de peluche.",
    "hair drier": "Secadora de cabello.",
    toothbrush: "Cepillo de dientes.",

    // 5. Riesgos de tropiezo y equipaje
    backpack: "Mochila o bulto en el camino, cuidado al pisar.",
    umbrella: "Paraguas detectado.",
    handbag: "Bolso en el camino.",
    tie: "Corbata.",
    suitcase: "Maleta o equipaje en el suelo, riesgo de tropiezo.",

    // 6. Deportes y recreacion
    frisbee: "Disco volador o frisbee.",
    skis: "Esquis.",
    snowboard: "Tabla de snowboard.",
    "sports ball": "Pelota en el suelo, riesgo de resbalon.",
    kite: "Cometa.",
    "baseball bat": "Bate de beisbol.",
    "baseball glove": "Guante de beisbol.",
    skateboard: "Patineta en el suelo, alto riesgo de resbalon.",
    surfboard: "Tabla de surf.",
    "tennis racket": "Raqueta de tenis.",

    // 7. Cocina y comida
    bottle: "Botella detectada, posible basura en el camino.",
    "wine glass": "Copa de vidrio, cuidado con romperla.",
    cup: "Taza o vaso.",
    fork: "Tenedor.",
    knife: "Cuchillo, objeto punzocortante.",
    spoon: "Cuchara.",
    bowl: "Plato hondo o tazon.",
    banana: "Platano (riesgo de resbalon si esta en el suelo).",
    apple: "Manzana.",
    sandwich: "Sandwich.",
    orange: "Naranja.",
    broccoli: "Brocoli.",
    carrot: "Zanahoria.",
    "hot dog": "Perro caliente (comida).",
    pizza: "Pizza.",
    donut: "Dona.",
    cake: "Pastel."
  };

  if (reglas[objeto]) {
    return reglas[objeto];
  }

  // Fallback de seguridad
  return "Objeto detectado en su entorno.";
};
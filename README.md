# Asistente Inteligente Visual (AIV)

Este proyecto es un asistente de movilidad y reconocimiento de billetes bolivianos diseñado para personas con discapacidad visual. Utiliza una arquitectura hibrida que combina procesamiento local en el celular y procesamiento avanzado en un servidor para detectar baches, objetos y dinero en tiempo real.

## Tecnologias Usadas

### Frontend
- React y Vite para la estructura del sitio.
- Tailwind CSS para el diseño de la interfaz.
- TensorFlow.js con el modelo COCO-SSD para deteccion de objetos local.
- Web Speech API para las alertas de voz en español.

### Backend
- Node.js y Express para la gestion del servidor y recepcion de imagenes.
- Python para ejecutar los modelos de inteligencia artificial avanzados.
- YOLOv8 (Ultralytics) para la deteccion de baches y clasificacion de billetes.
- OpenCV para el procesamiento de imagenes en el servidor.

---

## Guia de Instalacion y Uso

Sigue estos pasos para configurar el proyecto despues de clonarlo.

### 1. Requisitos
- Node.js instalado.
- Python 3.9 o superior instalado.

### 2. Configurar el Backend
Entra en la carpeta backend y ejecuta:
```bash
npm install
pip install ultralytics opencv-python
```

### 3. Entrenar los Modelos
Debes generar los modelos de IA antes de iniciar el servidor. Dentro de la carpeta backend ejecuta:
```bash
python train_baches.py
python train_billetes.py
```
Esto creara los archivos de pesos en la carpeta runs/.

### 4. Configurar el Frontend
Entra en la carpeta frontend/frontend-asis y ejecuta:
```bash
npm install
```

### 5. Configuracion de Red (Importante para el celular)
Para que el celular se conecte al servidor, debes abrir el archivo `frontend/frontend-asis/src/components/molecules/CameraBox.jsx` y cambiar la direccion IP por la direccion IPv4 actual de tu computadora (puedes verla usando el comando `ipconfig` en la terminal).

### 6. Ejecucion
Inicia ambos servidores en terminales separadas:

En /backend:
```bash
npm run dev
```

En /frontend/frontend-asis:
```bash
npm run dev
```

Accede desde tu celular a la direccion HTTPS que te proporcione Vite (usualmente https://tu-ip:5173).

## Instrucciones de Uso
- Doble toque: Activa/Desactiva el Modo Movilidad (detecta personas y baches).
- Triple toque: Activa/Desactiva el Modo Billetera (identifica billetes bolivianos).

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
### 4. Ejecución del Proyecto
Para iniciar el sistema completo:
1.  **Backend:** `cd backend` y luego `npm run dev`.
2.  **Frontend:** `cd frontend/frontend-asis` y luego `npm run dev`.

---

## Conexión con Dispositivos Móviles
Para probar la aplicación en un celular desde fuera de tu red local (por ejemplo, en la universidad), debes crear túneles seguros.

### Opción A: Usando Localtunnel
Abre dos terminales adicionales y ejecuta:
- **Para la Web:** `npx localtunnel --port 5173`
- **Para la IA:** `npx localtunnel --port 4000`

### Opción B: Usando SSH (Si Localtunnel está bloqueado)
Si estás en una red restringida como una universidad, usa este comando:
- `ssh -R 80:localhost:4000 nokey@localhost.run` (Para el Backend)
- `ssh -R 80:localhost:5173 nokey@localhost.run` (Para el Frontend)

> [!IMPORTANT]
> Recuerda actualizar la URL del backend en `CameraBox.jsx` con la dirección que te proporcione el túnel.

---

## Modos de Interacción
La aplicación está optimizada para ser usada sin ver la pantalla mediante gestos táctiles:
- **Doble Toque:** Activa el **Modo Movilidad** (Detección de baches, personas y obstáculos).
- **Triple Toque:** Activa el **Modo Billetera** (Identificación de billetes bolivianos).
- **Voz en tiempo real:** Todas las alertas se emiten mediante síntesis de voz en español.

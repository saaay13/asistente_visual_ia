import sys
import json
import cv2
import numpy as np
import base64
import os
from ultralytics import YOLO

# Intentar cargar el modelo entrenado, si no existe, usar el base
model_path = 'runs/detect/train/weights/best.pt'
if not os.path.exists(model_path):
    model_path = 'yolov8n.pt' # Modelo base si aún no se ha entrenado

model = YOLO(model_path) 

def predict(base64_str):
    try:
        # Limpiar el string base64 si trae el prefijo data:image/jpeg;base64,
        if ',' in base64_str:
            base64_str = base64_str.split(',')[1]
            
        img_data = base64.b64decode(base64_str)
        nparr = np.frombuffer(img_data, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if img is None:
            return {"detectado": False, "error": "No se pudo decodificar la imagen"}

        # Hacer la detección
        # conf=0.5 significa que debe estar 50% seguro de que es un bache
        results = model(img, conf=0.5, verbose=False)
        
        detectado = False
        for r in results:
            if len(r.boxes) > 0:
                detectado = True
                break
                
        return {"detectado": detectado}
    except Exception as e:
        return {"detectado": False, "error": str(e)}

if __name__ == "__main__":
    # Leer la imagen desde stdin (enviada por Node.js)
    try:
        input_data = sys.stdin.read()
        if input_data:
            resultado = predict(input_data)
            print(json.dumps(resultado))
        else:
            print(json.dumps({"detectado": False, "error": "No input data"}))
    except Exception as e:
        print(json.dumps({"detectado": False, "error": str(e)}))

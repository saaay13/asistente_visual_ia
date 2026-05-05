import sys
import json
import cv2
import numpy as np
import base64
import os
from ultralytics import YOLO

# --- CARGA DE MODELOS ---
# Modelo de Baches (Detección)
path_baches = 'runs/detect/train/weights/best.pt'
model_baches = YOLO(path_baches) if os.path.exists(path_baches) else YOLO('yolov8n.pt')

# Modelo de Billetes (Clasificación)
path_billetes = 'runs/classify/train/weights/best.pt'
model_billetes = YOLO(path_billetes) if os.path.exists(path_billetes) else None

def predict(base64_str):
    try:
        # 1. Decodificar imagen
        if ',' in base64_str:
            base64_str = base64_str.split(',')[1]
        img_data = base64.b64decode(base64_str)
        nparr = np.frombuffer(img_data, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if img is None:
            return {"error": "No se pudo decodificar la imagen"}

        resultado = {
            "bache": False,
            "billete": None,
            "confianza_billete": 0
        }

        # 2. Detección de Baches
        results_baches = model_baches(img, conf=0.5, verbose=False)
        if len(results_baches[0].boxes) > 0:
            resultado["bache"] = True

        # 3. Clasificación de Billetes (Solo si el modelo existe)
        if model_billetes:
            results_billetes = model_billetes(img, verbose=False)
            # Obtenemos la clase con mayor probabilidad
            probs = results_billetes[0].probs
            if probs.top1conf > 0.7: # Solo si estamos 70% seguros
                resultado["billete"] = results_billetes[0].names[probs.top1]
                resultado["confianza_billete"] = float(probs.top1conf)

        return resultado
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    try:
        input_data = sys.stdin.read()
        if input_data:
            res = predict(input_data)
            print(json.dumps(res))
    except Exception as e:
        print(json.dumps({"error": str(e)}))

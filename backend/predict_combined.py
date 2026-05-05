import sys
import json
import cv2
import numpy as np
import base64
import os
from ultralytics import YOLO

# Rutas de modelos entrenados
path_baches = 'runs/detect/train/weights/best.pt'
path_billetes = 'runs/classify/train/weights/best.pt'

# Carga de modelos con fallback a nano si no existen
model_baches = YOLO(path_baches) if os.path.exists(path_baches) else YOLO('yolov8n.pt')
model_billetes = YOLO(path_billetes) if os.path.exists(path_billetes) else None

def predict(base64_str):
  try:
    if ',' in base64_str:
      base64_str = base64_str.split(',')[1]
    
    img_data = base64.b64decode(base64_str)
    nparr = np.frombuffer(img_data, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if img is None:
      return {"error": "Error decodificacion"}

    resultado = {"bache": False, "billete": None, "confianza": 0}

    # Deteccion de baches
    res_b = model_baches(img, conf=0.5, verbose=False)
    if len(res_b[0].boxes) > 0:
      resultado["bache"] = True

    # Clasificacion de billetes
    if model_billetes:
      res_bill = model_billetes(img, verbose=False)
      probs = res_bill[0].probs
      if probs.top1conf > 0.7:
        resultado["billete"] = res_bill[0].names[probs.top1]
        resultado["confianza"] = float(probs.top1conf)

    return resultado
  except Exception as e:
    return {"error": str(e)}

if __name__ == "__main__":
  try:
    input_data = sys.stdin.read()
    if input_data:
      print(json.dumps(predict(input_data)))
  except Exception as e:
    print(json.dumps({"error": str(e)}))

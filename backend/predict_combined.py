import sys
import json
import cv2
import numpy as np
import base64
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO

app = Flask(__name__)
CORS(app)

def get_model(path_relative):
    search_paths = [
        path_relative,
        os.path.join(os.path.dirname(__file__), path_relative),
        os.path.join(os.getcwd(), path_relative),
        'best.pt',
    ]
    for p in search_paths:
        if os.path.exists(p):
            print(f"Cargando modelo desde {p}")
            return YOLO(p)
    return None

# Carga de modelos al iniciar el servidor (SOLO UNA VEZ)
print("--- Iniciando Modelos IA ---")
model_baches = get_model('runs/detect/train/weights/best.pt') or YOLO('yolov8n.pt')
model_billetes = get_model('runs/classify/train/weights/best.pt')
print("--- Modelos Listos ✅ ---")

@app.route('/predict', methods=['POST'])
def predict_route():
    try:
        data = request.get_json()
        if not data or 'image' not in data:
            return jsonify({"error": "No image provided"}), 400
        
        base64_str = data['image']
        if ',' in base64_str:
            base64_str = base64_str.split(',')[1]
        
        img_data = base64.b64decode(base64_str)
        nparr = np.frombuffer(img_data, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if img is None:
            return jsonify({"error": "Error decoding image"}), 400

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

        return jsonify(resultado)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    # Corremos en el puerto 5000 por defecto
    app.run(host='0.0.0.0', port=5000)

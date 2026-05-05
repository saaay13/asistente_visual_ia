from ultralytics import YOLO
import os

# Cargamos el modelo base de CLASIFICACIÓN
model = YOLO('yolov8n-cls.pt') 

try:
    print("Iniciando entrenamiento de Billetes Bolivianos...")
    # data='../dataset_b' apunta a la carpeta que contiene train/ y valid/
    results = model.train(
        data='../dataset_b', 
        epochs=15, 
        imgsz=224, 
        plots=True,
        device='cpu'
    )
    print("¡Entrenamiento de billetes completado!")
    print("Modelo guardado en: runs/classify/train/weights/best.pt")
except Exception as e:
    print(f"Error entrenando billetes: {e}")

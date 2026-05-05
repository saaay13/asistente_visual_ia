from ultralytics import YOLO
import os

# 1. Cargamos un modelo base muy ligero (Nano)
# Este modelo se descargará automáticamente la primera vez
model = YOLO('yolov8n.pt') 

# 2. Entrenamos con tu dataset
# La ruta apunta a ../dataset/data.yaml porque el script está en backend/
try:
    print("Iniciando entrenamiento con el dataset de baches...")
    results = model.train(
        data='../dataset/data.yaml', 
        epochs=15, 
        imgsz=640, 
        plots=True,
        device='cpu' # Usamos CPU por defecto para asegurar compatibilidad
    )
    print("¡Entrenamiento completado!")
    print("El modelo optimizado se encuentra en: runs/detect/train/weights/best.pt")
except Exception as e:
    print(f"Error durante el entrenamiento: {e}")
    print("Asegúrate de que la ruta ../dataset/data.yaml sea accesible.")

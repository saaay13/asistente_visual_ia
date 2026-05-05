from ultralytics import YOLO

# Carga modelo base para clasificacion
model = YOLO('yolov8n-cls.pt') 

try:
  print("Entrenando Billetes...")
  model.train(
    data='../dataset_b', 
    epochs=15, 
    imgsz=224, 
    device='cpu'
  )
  print("Fin entrenamiento billetes")
except Exception as e:
  print(f"Error: {e}")

from ultralytics import YOLO

# Carga modelo base nano
model = YOLO('yolov8n.pt') 

try:
  print("Entrenando Baches...")
  model.train(
    data='../dataset/data.yaml', 
    epochs=15, 
    imgsz=640, 
    device='cpu'
  )
  print("Fin entrenamiento baches")
except Exception as e:
  print(f"Error: {e}")

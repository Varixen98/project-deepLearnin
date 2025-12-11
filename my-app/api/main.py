# import utilities libraries
import io
import numpy as np 
import onnxruntime as ort 
from PIL import Image

# import fastapi
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


MODEL_PATH = "model/best.onnx"
CLASSES = ["glioma", "meningioma", "pituitary"]
CONF_THRESHOLD = 0.25
IOU_THRESHOLD = 0.45
INPUT_SIZE = 512


# Load Model
session = ort.InferenceSession(MODEL_PATH)
input_name = session.get_inputs()[0].name
output_name = session.get_outputs()[0].name


# preprocessing 
def preprocess(img_bytes):
    img = Image.open(io.BytesIO(img_bytes)).convert("RGB")

    original_size = img.size

    img_resized = img.resize((INPUT_SIZE, INPUT_SIZE))

    input_data = np.array(img_resized, dtype=np.float32) / 255.0
    input_data = input_data.transpose(2, 0, 1)

    input_data = np.expand_dims(input_data, axis=0)

    return input_data, original_size


def nms(boxes, scores, iou_threshold):
    """
    Non-Maximum Suppression to remove overlapping boxes.
    """
    # Sort boxes by score (high to low)
    indices = np.argsort(scores)[::-1]
    keep_boxes = []

    while len(indices) > 0:
        current = indices[0]
        keep_boxes.append(current)
        
        if len(indices) == 1: break
        
        # Calculate IoU with the rest
        rest_indices = indices[1:]
        
        # Coordinates of current box
        xx1 = np.maximum(boxes[current, 0], boxes[rest_indices, 0])
        yy1 = np.maximum(boxes[current, 1], boxes[rest_indices, 1])
        xx2 = np.minimum(boxes[current, 2], boxes[rest_indices, 2])
        yy2 = np.minimum(boxes[current, 3], boxes[rest_indices, 3])

        w = np.maximum(0, xx2 - xx1)
        h = np.maximum(0, yy2 - yy1)
        intersection = w * h
        
        area_current = (boxes[current, 2] - boxes[current, 0]) * (boxes[current, 3] - boxes[current, 1])
        area_rest = (boxes[rest_indices, 2] - boxes[rest_indices, 0]) * (boxes[rest_indices, 3] - boxes[rest_indices, 1])
        
        union = area_current + area_rest - intersection
        iou = intersection / union

        indices = rest_indices[iou < iou_threshold]
        
    return keep_boxes


def postprocess(output, original_size):
    """
    Parse YOLO output: [1, 7, 8400] -> Filter -> NMS -> Final Diagnosis
    """
    # Output shape: (1, 4+Classes, 8400)
    # Transpose to (8400, 7) for easier iteration
    predictions = np.squeeze(output[0]).T

    boxes = []
    scores = []
    class_ids = []

    # 1. Filter by Confidence
    # YOLO output format: [x, y, w, h, class1_conf, class2_conf, class3_conf]
    for row in predictions:
        class_scores = row[4:] # The class probabilities
        class_id = np.argmax(class_scores)
        max_score = class_scores[class_id]

        if max_score >= CONF_THRESHOLD:
            # Convert Center-XYWH to TopLeft-XYXY
            x, y, w, h = row[0:4]
            x1 = x - w / 2
            y1 = y - h / 2
            x2 = x + w / 2
            y2 = y + h / 2
            
            boxes.append([x1, y1, x2, y2])
            scores.append(max_score)
            class_ids.append(class_id)

    if not boxes:
        return {"diagnosis": "No Tumor", "confidence": 0.0, "details": "Healthy"}

    # 2. Apply NMS (Remove duplicates)
    boxes_np = np.array(boxes)
    scores_np = np.array(scores)
    keep_indices = nms(boxes_np, scores_np, IOU_THRESHOLD)

    # 3. Scale boxes back to original image size
    orig_w, orig_h = original_size
    scale_x = orig_w / INPUT_SIZE
    scale_y = orig_h / INPUT_SIZE

    final_results = []
    for idx in keep_indices:
        b = boxes_np[idx]
        final_results.append({
            "class": CLASSES[class_ids[idx]],
            "confidence": float(scores_np[idx]),
            "bbox": [
                int(b[0] * scale_x), int(b[1] * scale_y), 
                int(b[2] * scale_x), int(b[3] * scale_y)
            ]
        })

    # Return the highest confidence result as the primary diagnosis
    best_result = final_results[0]
    return {
        "diagnosis": best_result["class"],
        "confidence": round(best_result["confidence"], 2),
        "all_detections": final_results
    }

# testing connection
@app.get("/")
def root():
    return {"status": "success"
        ,"message": "Brain Tumor Detection API is running",
        "code": 200} 


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    # Read Image
    image_bytes = await file.read()
    
    # Preprocess
    input_tensor, original_size = preprocess(image_bytes)
    
    # Inference (ONNX)
    outputs = session.run([output_name], {input_name: input_tensor})
    
    # Postprocess
    result = postprocess(outputs, original_size)
    
    return result
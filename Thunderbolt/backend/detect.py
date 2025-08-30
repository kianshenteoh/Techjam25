from inference_sdk import InferenceHTTPClient
from concurrent.futures import ThreadPoolExecutor
import supervision as sv
import cv2, os

API_KEY = "pMwug7q0yu6Gg5kLLVdu"  # your actual API key
IMG_PATH = "input-images/mbs.jpg"

MODEL_PLATE = "license-plate-recognition-rxg4e/11"
MODEL_FLAG  = "flags-0viie/2"
MODEL_LANDMARK = "landmarks-i4oe1/1"
MODEL_ROADSIGN = "road-signs-6ih4y/1"

client = InferenceHTTPClient(
    api_url="https://serverless.roboflow.com",
    api_key=API_KEY,
)

# --- run all models in parallel ---
def run(model_id):
    return client.infer(IMG_PATH, model_id=model_id)

with ThreadPoolExecutor(max_workers=3) as ex:
    res_plate = ex.submit(run, MODEL_PLATE).result()
    res_flag  = ex.submit(run, MODEL_FLAG).result()
    res_landmark = ex.submit(run, MODEL_LANDMARK).result()
    res_roadsign = ex.submit(run, MODEL_ROADSIGN).result()

# --- draw combined output ---
img = cv2.imread(IMG_PATH)
det_plate = sv.Detections.from_inference(res_plate)
det_flag  = sv.Detections.from_inference(res_flag)
det_landmark = sv.Detections.from_inference(res_landmark)
det_roadsign = sv.Detections.from_inference(res_roadsign)

labels_plate = [f"license plate {c:.2f}" for c in det_plate.confidence]
labels_flag = [f"flag {c:.2f}" for c in det_flag.confidence]
labels_landmark = [f"landmark {c:.2f}" for c in det_landmark.confidence]
labels_roadsign = [f"landmark {c:.2f}" for c in det_roadsign.confidence]
box_annotator = sv.BoxAnnotator()
label_annotator = sv.LabelAnnotator()

out = img.copy()
out = box_annotator.annotate(out, det_plate)
out = label_annotator.annotate(out, det_plate, labels=labels_plate)
out = box_annotator.annotate(out, det_flag)
out = label_annotator.annotate(out, det_flag, labels=labels_flag)
out = box_annotator.annotate(out, det_landmark)
out = label_annotator.annotate(out, det_landmark, labels=labels_landmark)

cv2.imwrite("combined_annotated.jpg", out)
print("Saved combined_annotated.jpg")

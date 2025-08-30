import os
from inference_sdk import InferenceHTTPClient


API_KEY = "pMwug7q0yu6Gg5kLLVdu"
CLIENT = InferenceHTTPClient(
    api_url="https://infer.roboflow.com",
    api_key= API_KEY
)

result = CLIENT.ocr_image(inference_input="./input-images/images.jpg")

print(result)
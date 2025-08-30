from ultralytics import YOLOE
import polars as pl
import cv2
import numpy as np
        
model = YOLOE("yoloe-11l-seg-pf.pt")

position_revealing_items = [
    'asia temple', 'cheongsam', 'chinese knot', 'chinese rose', 'chinese tower',
    'forbidden city', 'hanfu', 'izakaya', 'jasmine', 'kimono', 'martial',
    'pagoda', 'palace', 'Prague Castle', 'sari', 'tatami', 'tempura',
    'tokyo tower', 'totem pole', 'zen garden', 'zongzi', 'airport',
    'airport runway', 'airport terminal', 'altar', 'art gallery', 'bank',
    'basketball stadium', 'bell tower', 'big ben', 'bridge', 'bay bridge',
    'cathedral', 'city hall', 'control tower', 'courthouse', 'department store',
    'Disneyland', 'Eiffel tower', 'Empire State Building', 'fire station',
    'gift shop', 'hindu temple', 'hospital', 'hotel', 'mosque', 'museum',
    'parliament', 'plaza', 'police car', 'police station', 'post office',
    'railway station', 'sky tower', 'skyscraper', 'state school',
    'subway station', 'synagogue', 'temple', 'tv tower', 'viaduct',
    'water tower', 'white house', 'winery', 'aircraft cabin', 'airliner',
    'ambulance', 'army tank', 'fighter jet', 'audi', 'automobile model',
    'bus', 'taxi', 'city bus', 'convertible', 'cruise ship', 'decker bus',
    'fire truck', 'motorboat', 'minivan', 'moped', 'motorcycle', 'police car',
    'recreational vehicle', 'sedan', 'speedboat', 'suv', 'tow truck', 'train',
    'trolley', 'truck', 'tugboat', 'van', 'vespa', 'badlands', 'bay', 'canyon',
    'cliff', 'crater lake', 'desert', 'fjord', 'glacier', 'hill country',
    'ice floe', 'iceberg', 'island', 'mountain', 'mountain range',
    'mountain snowy', 'rainforest', 'river bank', 'riverbed', 'rock formation',
    'salt marsh', 'salt lake', 'savanna', 'sea ice', 'snow mountain', 'swamp',
    'tundra', 'volcano', 'waterfall', 'wheat field', 'badge', 'banner',
    'bar code', 'billboard', 'brand', 'bulletin board', 'business card',
    'car logo', 'chassis', 'collage', 'credit card', 'number', 'flag',
    'flag pole', 'letter', 'mailbox', 'license plate', 'logo', 'national flag',
    'parking meter', 'parking sign', 'passport', 'placard', 'postcard',
    'poster', 'qr code', 'road sign', 'speed limit sign', 'stop sign',
    'signage', 'signature', 'traffic light', 'traffic sign', 'wallpaper',
    'whiteboard', 'app', 'app icon', 'baseball team', 'basketball team',
    'football team', 'camera', 'smartphone', 'computer', 'computer monitor',
    'desktop computer', 'film director', 'id photo', 'identity card', 'website',
    'laptop', 'movie ticket', 'photo', 'printed page', 'printer', 'receipt',
    'screenshot', 'storefront', 'tablet computer', 'text', 'text message',
    'watermark overlay stamp', 'car', 'people'
]

image = cv2.imread('./Data/test4.jpg')
results = model.predict(image)

df = results[0].to_df()
filtered_df = df.filter(pl.col("name").str.contains_any(position_revealing_items))

mask = np.zeros(image.shape[:2], dtype=np.uint8)


for segment in filtered_df['segments']:
    points = np.array(list(zip(segment['x'], segment['y'])), dtype=np.int32)
    points = points.reshape(-1, 1, 2)
    cv2.fillPoly(mask, [points], 255)


blurred = cv2.GaussianBlur(image, (51, 51), 30)
result = image.copy()
result[mask == 255] = blurred[mask == 255]  # Blur only masked areas

# Show and save the result
cv2.imwrite("blurred_output.jpg", result)
    
results[0].show()
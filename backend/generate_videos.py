import cv2
import numpy as np
import os
import glob

artifacts_dir = r"C:\Users\Administrator\.gemini\antigravity-ide\brain\a02b98ba-9aa8-498b-805c-d6cb68ff1ec2"
output_dir = r"d:\scratch\backend\media\hero_videos"

os.makedirs(output_dir, exist_ok=True)

# Map prefix to slug
prefix_map = {
    'araku': 'araku-valley',
    'taj': 'taj-mahal',
    'munnar': 'munnar',
    'hampi': 'hampi',
    'shillong': 'shillong',
    'jaipur': 'jaipur',
    'khajuraho': 'khajuraho',
    'goa': 'goa',
    'darjeeling': 'darjeeling'
}

fps = 30
duration = 10 # seconds
frames_count = fps * duration

for prefix, slug in prefix_map.items():
    # find image
    pattern = os.path.join(artifacts_dir, f"{prefix}*.png")
    matches = glob.glob(pattern)
    if not matches:
        print(f"Skipping {prefix}, no image found.")
        continue
    
    img_path = matches[0]
    img = cv2.imread(img_path)
    if img is None:
        print(f"Failed to read {img_path}")
        continue
        
    h, w, _ = img.shape
    
    # Target 1080p
    out_w, out_h = 1920, 1080
    
    # FourCC for mp4
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out_path = os.path.join(output_dir, f"{slug}.mp4")
    out = cv2.VideoWriter(out_path, fourcc, fps, (out_w, out_h))
    
    # Simple zoom effect
    # Start scale = 1.0 (covers screen)
    # End scale = 1.15
    
    # First, resize image to ensure it covers 1920x1080 at scale 1.0
    scale_initial = max(out_w / w, out_h / h)
    new_w, new_h = int(w * scale_initial), int(h * scale_initial)
    img_resized = cv2.resize(img, (new_w, new_h))
    
    center_x, center_y = new_w // 2, new_h // 2
    
    print(f"Generating video for {slug}...")
    for i in range(frames_count):
        progress = i / float(frames_count)
        # Scale from 1.0 to 1.15
        current_scale = 1.0 + (progress * 0.15)
        
        # Crop window size
        crop_w = int(out_w / current_scale)
        crop_h = int(out_h / current_scale)
        
        x1 = center_x - crop_w // 2
        y1 = center_y - crop_h // 2
        x2 = x1 + crop_w
        y2 = y1 + crop_h
        
        # Crop and resize back to 1080p
        cropped = img_resized[y1:y2, x1:x2]
        frame = cv2.resize(cropped, (out_w, out_h))
        
        out.write(frame)
        
    out.release()
    print(f"Saved {out_path}")

print("All videos generated successfully.")

import os
import glob
from moviepy import ImageClip
from PIL import Image

artifacts_dir = r"C:\Users\Administrator\.gemini\antigravity-ide\brain\a02b98ba-9aa8-498b-805c-d6cb68ff1ec2"
output_dir = r"d:\scratch\backend\media\hero_videos"
os.makedirs(output_dir, exist_ok=True)

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

duration = 10 # seconds
fps = 30

def process_image(prefix, slug):
    pattern = os.path.join(artifacts_dir, f"{prefix}*.png")
    matches = glob.glob(pattern)
    if not matches:
        print(f"Skipping {prefix}, no image found.")
        return
    
    img_path = matches[0]
    out_path = os.path.join(output_dir, f"{slug}.mp4")
    
    # We will use MoviePy to create a zooming clip
    # MoviePy's resize with a function is slow but effective
    # To keep it simple and ensure H264 encoding works perfectly,
    # we can just make it a static clip or use a simple pan/zoom
    
    clip = ImageClip(img_path).set_duration(duration)
    
    # Simple zoom effect: crop center with decreasing margin
    def resize_func(t):
        # scale goes from 1.0 to 1.15 over `duration` seconds
        progress = t / duration
        return 1.0 + (progress * 0.15)
    
    # It's faster and safer for browser compatibility to just encode a static image 
    # if the zoom effect is too complex, but let's try a simple zoom using margin
    def make_frame(get_frame, t):
        frame = get_frame(t)
        h, w = frame.shape[:2]
        
        # We want to crop to a 1920x1080 aspect ratio first
        target_aspect = 1920 / 1080
        current_aspect = w / h
        
        if current_aspect > target_aspect:
            # Crop width
            new_w = int(h * target_aspect)
            x1 = (w - new_w) // 2
            frame = frame[:, x1:x1+new_w]
        else:
            # Crop height
            new_h = int(w / target_aspect)
            y1 = (h - new_h) // 2
            frame = frame[y1:y1+new_h, :]
            
        # Now we apply zoom
        h, w = frame.shape[:2]
        progress = t / duration
        scale = 1.0 + (progress * 0.15)
        
        crop_w = int(w / scale)
        crop_h = int(h / scale)
        
        y1 = (h - crop_h) // 2
        x1 = (w - crop_w) // 2
        
        cropped = frame[y1:y1+crop_h, x1:x1+crop_w]
        
        # We MUST return exactly 1920x1080 for all frames or video encoding breaks
        from PIL import Image
        import numpy as np
        pil_img = Image.fromarray(cropped)
        resized = pil_img.resize((1920, 1080), Image.LANCZOS)
        return np.array(resized)

    # Use the fl method to modify frames
    zoomed_clip = clip.fl(lambda gf, t: make_frame(gf, t))
    
    print(f"Generating H.264 video for {slug}...")
    zoomed_clip.write_videofile(
        out_path, 
        fps=fps, 
        codec="libx264", 
        audio=False, 
        preset="ultrafast", 
        threads=4
    )

for prefix, slug in prefix_map.items():
    process_image(prefix, slug)

print("All H.264 videos generated successfully!")

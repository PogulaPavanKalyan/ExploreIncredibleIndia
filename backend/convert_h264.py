import os
import glob
import subprocess
import imageio_ffmpeg

input_dir = r"d:\scratch\backend\media\hero_videos"
ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()

videos = glob.glob(os.path.join(input_dir, "*.mp4"))

for video in videos:
    if "_h264" in video:
        continue
    
    out_video = video.replace(".mp4", "_h264.mp4")
    print(f"Converting {video} to H.264...")
    
    cmd = [
        ffmpeg_exe,
        "-y",
        "-i", video,
        "-vcodec", "libx264",
        "-pix_fmt", "yuv420p",
        out_video
    ]
    
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode == 0:
        os.remove(video)
        os.rename(out_video, video)
        print(f"Success: {video}")
    else:
        print(f"Failed: {video}")
        print(result.stderr)

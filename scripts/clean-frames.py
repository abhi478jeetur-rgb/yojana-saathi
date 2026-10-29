# Replace partially painted (white) frames from Playwright Firefox recordings with the previous good frame.
# Usage: python3 scripts/clean-frames.py in.webm out.mp4 WIDTH HEIGHT   (needs numpy + ffmpeg)
import subprocess, sys, numpy as np
src, out, W, H = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4])
dec = subprocess.Popen(['ffmpeg','-v','error','-i',src,'-vf',f'fps=25,scale={W}:{H}','-f','rawvideo','-pix_fmt','rgb24','-'], stdout=subprocess.PIPE)
enc = subprocess.Popen(['ffmpeg','-v','error','-y','-f','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r','25','-i','-',
  '-c:v','libx264','-preset','veryfast','-crf','18','-pix_fmt','yuv420p','-movflags','+faststart',out], stdin=subprocess.PIPE)
size = W*H*3; prev=None; bad=0; n=0
while True:
    buf = dec.stdout.read(size)
    if len(buf) < size: break
    f = np.frombuffer(buf, np.uint8).reshape(H, W, 3)
    white = (f[::4, ::4].min(axis=2) > 235).mean()
    n += 1
    if white > 0.18 and prev is not None or (prev is None and white > 0.18):
        bad += 1
        if prev is None: continue
        enc.stdin.write(prev); continue
    prev = buf; enc.stdin.write(buf)
enc.stdin.close(); enc.wait(); print(src, 'frames', n, 'replaced', bad)

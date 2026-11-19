from pathlib import Path
import re
import subprocess
import tempfile
from PIL import Image, ImageOps, ImageDraw
import imageio_ffmpeg

paths = [
    Path('public/Hauwa Video.mp4'),
    Path('public/HAUWA VIDEO TO IMMIGRANT.mp4'),
    *sorted(Path.home().joinpath('Downloads').glob('WhatsApp Video 2026-11-19 at 02.*.mp4')),
]
ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
cards = []
for path in paths:
    probe = subprocess.run([ffmpeg, '-hide_banner', '-i', str(path)], capture_output=True, text=True)
    info = probe.stderr
    duration = re.search(r'Duration: ([0-9:.]+)', info)
    video = re.search(r'Video:.*?(\d{2,5})x(\d{2,5})[^\n]*', info)
    audio = re.search(r'Audio:([^\n]*)', info)
    seconds = 0
    if duration:
        h, m, s = duration.group(1).split(':')
        seconds = int(h)*3600 + int(m)*60 + float(s)
    print(f'{path}: {path.stat().st_size/1024/1024:.1f} MB; {duration.group(1) if duration else "unknown"}; {video.group(0) if video else "no video"}; audio={bool(audio)}')
    thumbs = []
    for pos in (0.1, 0.5, 0.9):
        with tempfile.NamedTemporaryFile(suffix='.jpg', delete=False) as tmp:
            output = Path(tmp.name)
        subprocess.run([ffmpeg, '-hide_banner', '-loglevel', 'error', '-ss', str(seconds*pos), '-i', str(path), '-frames:v', '1', '-q:v', '3', '-y', str(output)], capture_output=True)
        if output.stat().st_size:
            with Image.open(output) as frame:
                thumbs.append(ImageOps.contain(frame.convert('RGB'), (280, 200)).copy())
        output.unlink(missing_ok=True)
    cards.append((path.name, thumbs))
sheet = Image.new('RGB', (900, len(cards)*250), 'white')
draw = ImageDraw.Draw(sheet)
for i, (name, thumbs) in enumerate(cards):
    draw.text((12, i*250+7), name, fill='black')
    for j, thumb in enumerate(thumbs):
        sheet.paste(thumb, (j*300+10, i*250+38))
sheet.save(Path(tempfile.gettempdir())/'dwn-video-contact-sheet.jpg', quality=88)
print('CONTACT_SHEET=' + str(Path(tempfile.gettempdir())/'dwn-video-contact-sheet.jpg'))

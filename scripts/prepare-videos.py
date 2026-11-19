from pathlib import Path
import subprocess
import imageio_ffmpeg

ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
assets = [
    (Path.home()/'Downloads'/'WhatsApp Video 2026-11-19 at 02.27.22.mp4', 'dwn-founder-story', 24),
    (Path.home()/'Downloads'/'WhatsApp Video 2026-11-19 at 02.26.44.mp4', 'dwn-community-intro', 28),
    (Path('public/HAUWA VIDEO TO IMMIGRANT.mp4'), 'immigrant-message', 27),
    (Path('public/Hauwa Video.mp4'), 'online-opportunities', 48),
]
for source, stem, poster_second in assets:
    poster = Path('public')/f'{stem}-poster.jpg'
    subprocess.run([ffmpeg,'-hide_banner','-loglevel','error','-ss',str(poster_second),'-i',str(source),'-frames:v','1','-vf','scale=480:-2','-q:v','4','-y',str(poster)],check=True)
    if source.parent.name == 'Downloads':
        target = Path('public')/f'{stem}.mp4'
        subprocess.run([ffmpeg,'-hide_banner','-loglevel','error','-i',str(source),'-vf','scale=360:-2','-c:v','libx264','-preset','medium','-crf','29','-c:a','aac','-b:a','64k','-movflags','+faststart','-y',str(target)],check=True)
        print(f'{target}: {target.stat().st_size/1024/1024:.2f} MB')
    print(f'{poster}: {poster.stat().st_size/1024:.1f} KB')

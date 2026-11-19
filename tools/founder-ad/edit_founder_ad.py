"""Edit kit for the founder ad.

python edit_founder_ad.py RAW.mp4 OUT_DIR [--vtt cues.vtt] [--labels labels.json] [--no-trim] [--model medium.en]

What it does, in order:
  1. Trims long pauses (keeps natural short ones) and scales the video to the ad canvas.
  2. Writes captions: uses --vtt if given (its times must match the TRIMMED video, so only use it with --no-trim),
     otherwise transcribes the trimmed video with Whisper and builds short two-line captions.
  3. Burns in captions and optional big on-screen labels.
  4. Normalises loudness and appends a 2.5 s end card with the fine print.
  5. Exports 9:16 (Reels, Stories) and 4:5 (feed) H.264/AAC files.
Nothing is uploaded anywhere. Review every output before it is used.
"""
import argparse, json, re, subprocess, sys, tempfile
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

FONT = "C:/Windows/Fonts/arialbd.ttf"
FPS = 30
END_SECONDS = 2.5
FINE_PRINT = "Educational content. Results vary. No income is guaranteed. Not affiliated with any platform mentioned."
END_LINES = ["Free guides:", "link below"]
SIGNATURE = ["Dr. Hauwa", "Diaspora Wealth Network"]
BRAND = (14, 51, 40)
ACCENT = (212, 246, 112)
IVORY = (244, 241, 234)


def run(cmd, **kw):
    r = subprocess.run(cmd, capture_output=True, text=True, **kw)
    if r.returncode:
        sys.exit(f"Command failed: {' '.join(map(str, cmd[:4]))} ...\n{r.stderr[-1500:]}")
    return r


def probe_duration(path):
    r = run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)])
    return float(r.stdout.strip())


def speech_segments(path, noise="-32dB", min_silence=0.7, pad=0.18):
    """Find the parts to keep. Silences longer than min_silence are removed; pad keeps natural breathing room."""
    total = probe_duration(path)
    r = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(path), "-af", f"silencedetect=noise={noise}:d={min_silence}", "-f", "null", "-"],
                       capture_output=True, text=True)
    starts = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", r.stderr)]
    ends = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", r.stderr)]
    segs, cursor = [], 0.0
    for i, s in enumerate(starts):
        if s - cursor > 0.25:
            segs.append((max(0.0, cursor - pad), min(total, s + pad)))
        cursor = ends[i] if i < len(ends) else total
    if total - cursor > 0.25:
        segs.append((max(0.0, cursor - pad), total))
    merged = []
    for a, b in segs:
        if merged and a <= merged[-1][1]:
            merged[-1] = (merged[-1][0], max(b, merged[-1][1]))
        else:
            merged.append((a, b))
    return merged or [(0.0, total)]


def trim_and_scale(src, dst, w, h, trim):
    segs = speech_segments(src) if trim else [(0.0, probe_duration(src))]
    parts_v, parts_a = [], []
    for i, (a, b) in enumerate(segs):
        parts_v.append(f"[0:v]trim={a:.3f}:{b:.3f},setpts=PTS-STARTPTS[v{i}]")
        parts_a.append(f"[0:a]atrim={a:.3f}:{b:.3f},asetpts=PTS-STARTPTS[a{i}]")
    joined = "".join(f"[v{i}][a{i}]" for i in range(len(segs)))
    graph = ";".join(parts_v + parts_a) + f";{joined}concat=n={len(segs)}:v=1:a=1[cv][ca];" \
        f"[cv]scale={w}:{h}:force_original_aspect_ratio=increase,crop={w}:{h},fps={FPS},setsar=1[v];" \
        f"[ca]loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000[a]"
    run(["ffmpeg", "-y", "-hide_banner", "-i", str(src), "-filter_complex", graph, "-map", "[v]", "-map", "[a]",
         "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "160k", str(dst)])
    return segs


# ---------- captions ----------
def parse_vtt(path):
    cues = []
    for block in re.split(r"\n\n+", Path(path).read_text(encoding="utf-8").strip())[1:]:
        lines = block.split("\n")
        m = re.match(r"(?:(\d+):)?(\d+):([\d.]+) --> (?:(\d+):)?(\d+):([\d.]+)", lines[0])
        if not m:
            continue
        g = m.groups()
        s = int(g[0] or 0) * 3600 + int(g[1]) * 60 + float(g[2])
        e = int(g[3] or 0) * 3600 + int(g[4]) * 60 + float(g[5])
        cues.append((s, e, " ".join(lines[1:]).strip()))
    return cues


def whisper_cues(video, model, workdir):
    run([sys.executable, "-m", "whisper", str(video), "--model", model, "--language", "en", "--word_timestamps", "True",
         "--output_format", "json", "--output_dir", str(workdir), "--fp16", "False", "--temperature", "0",
         "--condition_on_previous_text", "False"])
    data = json.loads((Path(workdir) / (Path(video).stem + ".json")).read_text(encoding="utf-8"))
    words = [{"w": w["word"].strip(), "s": w["start"], "e": w["end"]} for seg in data["segments"] for w in seg.get("words", [])]
    cues, cur = [], []
    for w in words:
        trial = cur + [w]
        text = " ".join(x["w"] for x in trial)
        if cur and (len(text) > 56 or trial[-1]["e"] - trial[0]["s"] > 4.5):
            cues.append(cur); cur = [w]
        else:
            cur = trial
        if re.search(r"[.!?]$", w["w"]) and cur[-1]["e"] - cur[0]["s"] >= 1.0:
            cues.append(cur); cur = []
    if cur:
        cues.append(cur)
    return [(c[0]["s"], c[-1]["e"], " ".join(x["w"] for x in c)) for c in cues]


def wrap_pixels(draw, text, font, max_w):
    words, lines, cur = text.split(), [], ""
    for w in words:
        trial = (cur + " " + w).strip()
        if draw.textlength(trial, font=font) <= max_w:
            cur = trial
        else:
            lines.append(cur); cur = w
    lines.append(cur)
    return lines


def caption_png(text, path, width, size, max_w, stroke):
    font = ImageFont.truetype(FONT, size)
    probe = ImageDraw.Draw(Image.new("RGBA", (10, 10)))
    lines = wrap_pixels(probe, text, font, max_w)
    lh = int(size * 1.22)
    img = Image.new("RGBA", (width, lh * len(lines) + stroke * 2), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    for i, line in enumerate(lines):
        x = (width - d.textlength(line, font=font)) / 2
        d.text((x, stroke + i * lh), line, font=font, fill=(255, 255, 255, 255), stroke_width=stroke, stroke_fill=(0, 0, 0, 255))
    img.save(path)
    return img.size


def end_card_png(path, w, h):
    img = Image.new("RGB", (w, h), BRAND)
    d = ImageDraw.Draw(img)
    big, mid, small = ImageFont.truetype(FONT, int(w * .105)), ImageFont.truetype(FONT, int(w * .06)), ImageFont.truetype(FONT, int(w * .034))
    y = int(h * .30)
    for line in END_LINES:
        d.text(((w - d.textlength(line, font=big)) / 2, y), line, font=big, fill=ACCENT); y += int(w * .13)
    y += int(h * .05)
    for i, line in enumerate(SIGNATURE):
        f = mid if i == 0 else small
        d.text(((w - d.textlength(line, font=f)) / 2, y), line, font=f, fill=IVORY); y += int(w * (.08 if i == 0 else .06))
    fine_lines = wrap_pixels(d, FINE_PRINT, small, w * .84)
    y = int(h * .80)
    for line in fine_lines:
        d.text(((w - d.textlength(line, font=small)) / 2, y), line, font=small, fill=IVORY); y += int(w * .045)
    img.save(path)


def burn_and_finish(trimmed, cues, labels, out_path, w, h, caption_y, tmp):
    inputs, chains, last, idx = ["-i", str(trimmed)], [], "[0:v]", 1
    size = int(w * 0.058)
    for n, (s, e, text) in enumerate(cues):
        png = Path(tmp) / f"cap_{w}x{h}_{n}.png"
        caption_png(text, png, w, size, int(w * 0.86), 6)
        inputs += ["-i", str(png)]
        out = f"[c{n}]"
        chains.append(f"{last}[{idx}:v]overlay=x=0:y={caption_y}:enable='between(t,{s:.3f},{e:.3f})'{out}")
        last, idx = out, idx + 1
    for n, item in enumerate(labels):
        png = Path(tmp) / f"lab_{w}x{h}_{n}.png"
        caption_png(item["text"], png, w, int(w * 0.095), int(w * 0.88), 8)
        inputs += ["-i", str(png)]
        out = f"[l{n}]"
        chains.append(f"{last}[{idx}:v]overlay=x=0:y={int(h * .22)}:enable='between(t,{item['start']:.3f},{item['end']:.3f})'{out}")
        last, idx = out, idx + 1
    body = Path(tmp) / f"body_{w}x{h}.mp4"
    graph = ";".join(chains) + f";{last}format=yuv420p[vout]" if chains else f"{last}format=yuv420p[vout]"
    run(["ffmpeg", "-y", "-hide_banner", *inputs, "-filter_complex", graph, "-map", "[vout]", "-map", "0:a",
         "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-c:a", "copy", str(body)])
    card_png, card = Path(tmp) / f"end_{w}x{h}.png", Path(tmp) / f"end_{w}x{h}.mp4"
    end_card_png(card_png, w, h)
    run(["ffmpeg", "-y", "-hide_banner", "-loop", "1", "-t", str(END_SECONDS), "-i", str(card_png), "-f", "lavfi", "-t", str(END_SECONDS),
         "-i", "anullsrc=r=48000:cl=stereo", "-vf", f"fps={FPS},format=yuv420p", "-c:v", "libx264", "-crf", "18", "-c:a", "aac", "-b:a", "160k", "-shortest", str(card)])
    run(["ffmpeg", "-y", "-hide_banner", "-i", str(body), "-i", str(card), "-filter_complex", "[0:v][0:a][1:v][1:a]concat=n=2:v=1:a=1[v][a]",
         "-map", "[v]", "-map", "[a]", "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "160k",
         "-movflags", "+faststart", str(out_path)])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("raw"); ap.add_argument("out")
    ap.add_argument("--vtt"); ap.add_argument("--labels"); ap.add_argument("--no-trim", action="store_true")
    ap.add_argument("--model", default="medium.en")
    a = ap.parse_args()
    out = Path(a.out); out.mkdir(parents=True, exist_ok=True)
    labels = json.loads(Path(a.labels).read_text(encoding="utf-8")) if a.labels else []
    with tempfile.TemporaryDirectory() as tmp:
        trimmed = Path(tmp) / "trimmed_916.mp4"
        segs = trim_and_scale(a.raw, trimmed, 1080, 1920, not a.no_trim)
        kept = sum(b - x for x, b in segs)
        print(f"Kept {kept:.1f}s of {probe_duration(a.raw):.1f}s in {len(segs)} segments")
        if a.vtt:
            if not a.no_trim:
                sys.exit("--vtt needs --no-trim, because caption times must match the trimmed video.")
            cues = parse_vtt(a.vtt)
        else:
            cues = whisper_cues(trimmed, a.model, tmp)
        (out / "captions.vtt").write_text("WEBVTT\n\n" + "\n\n".join(
            f"{int(s // 60):02d}:{s % 60:06.3f} --> {int(e // 60):02d}:{e % 60:06.3f}\n{t}" for s, e, t in cues), encoding="utf-8")
        print(f"{len(cues)} caption cues")
        burn_and_finish(trimmed, cues, labels, out / "founder-ad_9x16.mp4", 1080, 1920, int(1920 * .60), tmp)
        # 4:5 feed version: re-frame from the same trimmed pass
        feed = Path(tmp) / "trimmed_45.mp4"
        run(["ffmpeg", "-y", "-hide_banner", "-i", str(trimmed), "-vf", "crop=1080:1350:0:285", "-c:v", "libx264", "-crf", "18", "-c:a", "copy", str(feed)])
        burn_and_finish(feed, cues, labels, out / "founder-ad_4x5.mp4", 1080, 1350, int(1350 * .62), tmp)
    for f in sorted(out.iterdir()):
        print(f.name, f"{f.stat().st_size / 1e6:.1f} MB")


if __name__ == "__main__":
    main()

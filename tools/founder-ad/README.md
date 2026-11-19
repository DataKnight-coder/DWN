# Founder ad edit kit

`edit_founder_ad.py RAW.mp4 OUT_DIR [--labels labels.json] [--model medium.en]`

Trims long pauses, transcribes, burns in captions and big labels, normalises loudness to about -16 LUFS,
appends a 2.5 s end card with the fine print, and exports `founder-ad_9x16.mp4` (Reels, Stories) and
`founder-ad_4x5.mp4` (feed). Labels file example: `[{"start":0.2,"end":3.5,"text":"Walmart freezer. PhD."}]`.
Needs ffmpeg, Python with Pillow and openai-whisper. A 50 s clip takes roughly 10 minutes on this machine.
Always review the outputs before they are used as an ad. Nothing is uploaded.

# Caption drafts: NOT published, need human review

Generated with Whisper `medium.en` from the site's six video files. These files live outside `public/`, so nothing here is served on the website. Do not publish until each line has been checked against the audio by someone who knows the content.

## Status

| Video (site file) | Draft | Status |
|---|---|---|
| `dwn-founder-story.mp4` (about 63 s) | `dwn-founder-story.vtt` | Draft ready. Needs fixes below. |
| `dwn-community-intro.mp4` (about 50 s) | `dwn-community-intro.vtt` | Draft ready. Needs fixes below. |
| `dwn-two-versions.mp4` (about 38 s) | `dwn-two-versions.vtt` | Draft ready. Needs fixes below. No punctuation or capitals. |
| `dwn-wins.mp4` (about 48 s) | `dwn-wins.vtt` | Draft ready. Contains a figure that disagrees with the on-screen text. |
| `Hauwa Video.mp4` (about 90 s) | `Hauwa Video.vtt` | Draft ready. Cues are 8-15 s long; re-time before use. |
| `HAUWA VIDEO TO IMMIGRANT.mp4` (about 4 min) | not finished | Transcription still running or failed. Needs re-run. |

## Suspected transcription errors (verify against audio)

- **founder-story:** "between range" (probably "between rent..."); "free webinar" wording.
- **community-intro:** "exploring Jesus skills" (unclear word); "hundreds of random videos promising you a nice success even I can promise you that" (garbled); "diaspora world network" should be Wealth; "free webinar titled On Your Future" (title unconfirmed).
- **two-versions:** "he's had a Walmart freezer with a PhD" (probably "I had"); no sentence breaks.
- **wins:** "winds wall" should be "wins wall"; "Dr. Hawa" should be "Dr. Hauwa".
- **Hauwa Video:** "not liberating these systems" (unclear); "join the free wassup class" (unclear, maybe WhatsApp); "Guys, stop doling" (unclear); "keeping any interest" (probably "inventory").

## Content problems found in videos already live on the site

These are visible only because of the transcripts. They are about the videos, not the captions.

1. **`dwn-wins.mp4`:** the spoken line is "I've built about **$2 million** in real estate", but the on-screen text shows **$1.4M**. Please confirm which figure is correct and re-edit the video if needed.
2. **`dwn-founder-story.mp4` and `dwn-community-intro.mp4`:** both ask viewers to "register using the link on the screen", "send me a DM" or "comment the word free". Those instructions are for social media and do not match the website. The "free webinar" they promote may also be out of date.
3. **`Hauwa Video.mp4`:** says "I am hosting a class on **Saturday**" and "go to the link on my bio". The date is unspecified and will be wrong whenever the class has passed.
4. **`dwn-two-versions.mp4`:** states DWN costs **$147 for the whole year**, about 40 cents a day. The site now also states $147/year. If the price changes, this video becomes wrong.

## Timing note

Whisper produced coarse cue boundaries (some over 10 seconds). Before publishing, split long cues into one or two lines of at most about 42 characters and 6 seconds each, and re-check sync by playing each video with the captions on.

## To publish later

1. Correct the text above and re-time the cues.
2. Save the reviewed files as `public/captions/<name>.en.vtt`.
3. Add `<track kind="captions" srclang="en" label="English" src="...">` to each video element.

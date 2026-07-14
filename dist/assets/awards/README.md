# Awards & Community Photos

Drop the Chairman-awarding-workers photos here.

## Naming convention (required)

`award-01.jpg`, `award-02.jpg`, `award-03.jpg`, … (2-digit, zero-padded)

The website's Awards section auto-discovers files in this folder and displays them
in a grid + lightbox. As long as the file exists at
`dist/assets/awards/award-NN.jpg`, it will show up.

## Requirements

- Format: **JPG** (JPEG). Not `.jpeg`, not PNG — the site probes for `.jpg`.
- Recommended size: **1600 x 1200 px** or larger (landscape orientation ideal).
- Under **~500 KB per file** for fast loading (use TinyPNG or similar to compress).
- No maximum count — the section paginates naturally.

## After adding photos

Once you've dropped them into this folder, `git add . && git commit -m "add award photos" && git push` and Netlify will redeploy automatically.

If you'd like captions under each photo, provide a list like this in a message:

```
award-01: Chairman presenting long-service awards, Doha, 2024
award-02: Site safety milestone recognition, Lusail, 2023
…
```

and the captions will be wired up.

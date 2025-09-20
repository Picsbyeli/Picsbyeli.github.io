# Picsbyeli.github.io

Riddles, trivia, and brain games single-page app.

Run locally
1. Serve the folder (Python simple HTTP server is simple and available on macOS):

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/standalone.html` in your browser.

Playwright tests
- Install Playwright (if you don't have it):

```bash
npx playwright install
```

- Run the Playwright tests in headed mode:

```bash
npm run test:playwright -- --headed
```

Notes
- Audio files are in `assets/audio/` and the header audio UI lets you select tracks per-mode, control play/pause, volume, skip, and manage a small queue.

Run server & Playwright (dev)
1. Start a static server from the project root (serves `standalone.html`):

```bash
python3 -m http.server 8000
```

2. Start the backend (in a separate terminal):

```bash
cd server
npm install
npm start
```

3. Run the Playwright tests using the runner script (this will start/reuse servers when possible):

```bash
node ./scripts/run-playwright-with-backend.js
```

If you prefer Playwright directly, make sure Playwright is installed and browsers are available:

```bash
npx playwright install --with-deps
npm run test:playwright -- --headed
```

<!-- CI retrigger: 2025-09-19T12:33:00Z -->

Deployment to GitHub Pages
-------------------------

This repository publishes the `standalone.html` + `assets` directory to GitHub Pages via the Actions workflow in `.github/workflows/deploy-pages.yml`.

If your repository uses branch protection rules that prevent the default `GITHUB_TOKEN` from pushing to `gh-pages`, create a Personal Access Token (PAT) with `repo` scope and add it to the repository secrets as `DEPLOY_PERSONAL_TOKEN`.

Once `DEPLOY_PERSONAL_TOKEN` exists, the workflow will use it automatically. The published site is available at:

	- `https://<owner>.github.io/<repo>/` (for a user/org repo it may be `https://<owner>.github.io/`)

For this repository the expected Pages URL is:

	- `https://Picsbyeli.github.io/`

Including audio in a Pages publish
---------------------------------

By default the Pages publish excludes the `assets/audio/` directory to keep the published site small and fast. If you want to include audio files in a publish you have two recommended options:

Option A (recommended): Host audio externally (S3, Cloudflare R2, GitHub Releases, or another CDN) and reference remote URLs from `standalone.html`. This keeps Pages lightweight and fast.

Option B: Trigger the deploy workflow with `include_audio=true`. The workflow supports a `workflow_dispatch` input called `include_audio` (defaults to `false`) and `audio_bitrate` (default `64k`) to compress audio on-the-fly using `ffmpeg` during the Pages preparation step.

Trigger from the Actions UI: open the 'Deploy to GitHub Pages' workflow and run it manually with `include_audio=true`.

Trigger from the API (example using a PAT stored in `DEPLOY_PERSONAL_TOKEN`):

```bash
curl -X POST \
	-H "Accept: application/vnd.github+json" \
	-H "Authorization: Bearer $DEPLOY_PERSONAL_TOKEN" \
	https://api.github.com/repos/Picsbyeli/Picsbyeli.github.io/actions/workflows/deploy-pages.yml/dispatches \
	-d '{"ref":"main","inputs":{"include_audio":"true","audio_bitrate":"64k"}}'
```

Notes:
- The workflow will install `ffmpeg` on the Ubuntu runner to compress audio; compression adds time and compute cost to the run.
- Consider compressing and hosting audio once (e.g., in `gh-pages` or a Releases asset) and referencing remote URLs for faster subsequent publishes.


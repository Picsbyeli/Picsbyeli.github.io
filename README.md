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


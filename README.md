# ITEC 300 — Networking Learning Lab

Interactive learning website for **ITEC 300 – Computer Communications and Networking**, **Dr. Maher Alrahhal**, covering Week 3 and Week 4.

## Install

Install Node.js 22 or newer (Node 24 was used for validation). Open this `itec300` folder in VS Code, then open its terminal.

There are **no third-party packages to install**. All application and test code uses browser or Node built-in APIs. `npm install` is unnecessary.

## Run locally

```powershell
npm.cmd run dev
```

Open **http://127.0.0.1:4173**. Keep the terminal running; press `Ctrl+C` to stop it. On macOS/Linux use `npm run dev`. On this Windows machine, `npm.cmd` avoids PowerShell's script execution restriction.

Alternative, without npm:

```powershell
node scripts/serve.mjs
```

Open through the local HTTP server rather than double-clicking `index.html`; the application uses JavaScript modules. To use another port in PowerShell:

```powershell
$env:PORT = '4200'
node scripts/serve.mjs
```

## Test

Run the automated content/model checks:

```powershell
npm.cmd test
```

Run the browser integration and responsive checks:

```powershell
npm.cmd run test:browser
```

The browser test starts its own HTTP server on port 4174 and an isolated, headless Chrome/Edge profile. It does not use your normal browser profile. Chrome or Edge must be installed. Common Windows, Linux and macOS locations are detected. If necessary, specify an executable:

```powershell
$env:BROWSER_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
npm.cmd run test:browser
```

Test output goes to `test-results/`: JSON report, desktop/mobile screenshots and isolated temporary browser profiles. This directory is excluded from source control and should not be deployed. The browser suite checks lesson routes, demo controls, media scenarios, bit editing, all simulator combinations, animation stages, progress persistence, drag/drop and button-based matching, both quizzes, retries and responsive overflow at 375, 768 and 1440 pixels. Browser tests use the local DevTools protocol; no testing service is required.

The creation environment already isolates subprocesses and required `ITEC_CONTAINED_BROWSER_TEST=1` for its headless browser. This opt-in uses an isolated local-only QA profile without Chrome's nested sandbox; it does not change the installed browser's settings or your normal profile. Leave it unset on a normal machine. The test report records whether the option was used.

For classroom preparation, also open the site at your projector's resolution and try browser zoom at 200%. Buttons work with Tab and Enter/Space. Matching can be completed by selecting an item and then its destination, without dragging.

## Build

```powershell
npm.cmd run build
```

This validates the production entry point and JavaScript modules. The website is deliberately buildless: **`dist/` contains the authored, complete production files**, so the build command validates them instead of generating duplicate files. No compilation, CDN, external font or runtime package is needed.

Preview the same production files:

```powershell
npm.cmd run preview
```

## Deploy

The project is prepared for later publication; no online account or deployment is required for local use.

1. Run `npm.cmd test`, `npm.cmd run test:browser`, and `npm.cmd run build`.
2. Upload **the contents of `dist/`** to the public folder of any static web host. `index.html` must be at that folder's root.
3. If the host asks for a build command, use `npm run build`. Set its publish/output directory to `dist`.
4. Open the resulting HTTPS URL and follow Home, Week 3, Week 4, Activities and Quiz.

Routes use hash fragments, such as `/#week3/flow`, so no server-side rewrite rules are required. All asset paths are relative, allowing deployment under a subdirectory. Do not upload `test-results/`, the original course document, or Node test/server scripts. No environment variables, database, login, backend or API keys are required by the published site.

## Project structure

```text
itec300/
  dist/
    index.html       Accessible page shell and local SVG favicon
    styles.css       Responsive visual theme and CSS animation
    app.js           Navigation, lessons, saved progress and quizzes
    course.js        Local topic text, quiz banks and practice scenarios
    demos.js         Reusable signal, circuit and path demonstrations
    activities.js    Practice questions and accessible matching
    model.js         Scoring, signal states and simulator rules
  scripts/
    serve.mjs        Local static server
    build.mjs        Production file and syntax validation
  tests/
    course.test.mjs  Content and learning-model checks
    browser.mjs      Headless interaction and responsive tests
    devtools-socket.mjs  Dependency-free local test transport
  SOURCE_NOTES.md    Academic scope, source mapping and simplifications
  README.md
  package.json
```

## Use in class and for self-study

- **Home:** two module cards, full CLO statements and overall progress.
- **Week 3:** 8 topics covering circuits, configurations, flow, multiplexing, media, wireless paths, selection and the complete connection story.
- **Week 4:** 13 topics covering data, signals, coding, polarity, conversion, modulation, modems, voice and the transmission simulator.
- **Activities:** all seven learning checkpoints, plus the media selection challenge, available separately for practice.
- **Quiz:** 10 questions per week, immediate feedback, a score out of 10, answer review and unlimited retries. The first submitted answer counts; selecting an option alone does not submit it.
- **Progress:** manually mark a topic complete once you can explain it. Click again to mark it incomplete. Completion and best quiz scores are stored locally in this browser, with no server upload or cross-device synchronization. Private/incognito browsing may clear them when closed.
- **Animations:** use the top-level pause button. Reduced-motion preferences start the site with animations paused. Path demonstrations can be advanced one step at a time while paused. Diagrams and written labels remain available without animation.

To reset progress, clear this site's browser storage/site data. This removes only local learning state, not the source files. An unfinished quiz attempt is not retained after a page reload.

## Editing content

Edit topic descriptions, quiz questions and scenario answers in `dist/course.js`. Quiz `answer` values are zero-based option indexes. Edit simulator support rules in `dist/model.js` only after checking the academic source. Keep all academic additions aligned with the supplied teaching document.

The site also feature-detects the optional browser WebMCP API and exposes a read-only `read_learning_progress` tool when supported. Normal learning functionality does not depend on it.

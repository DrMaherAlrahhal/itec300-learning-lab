# Validation report

Validated on 3 October 2026 using Node.js 24.16.0 and headless Chrome 154 on Windows.

- **7/7 automated content and model tests passed.**
- **444 browser integration assertions passed.**
- **Production validation/build passed.**
- **No browser JavaScript runtime errors were reported.**
- Desktop home, desktop modulation and mobile data-flow screenshots were visually reviewed.

Coverage includes all 21 topic routes, the main navigation, Previous/Next Topic navigation, diagram selections, half/full-duplex behavior, all media explanations and challenge answers, editable bits, three modulation modes, analog waveform controls, all 12 simulator combinations, animated path stages, paused manual stepping, reduced-motion preference, topic completion/reload persistence, classification, question and diagram checkpoints, drag/drop and button-based matching, both ten-question quizzes, correct/incorrect feedback, perfect/zero scores, answer reviews, retries and best-score retention.

All lesson routes, Home, Activities and Quiz selection were checked for horizontal overflow at **375px, 768px and 1440px** viewport widths. This covers representative phone, tablet and desktop layouts; it does not constitute testing on every physical device or browser engine.

The automated browser used a new, isolated QA profile and local test server. The environment's existing process containment required the optional `ITEC_CONTAINED_BROWSER_TEST=1` mode. No installed browser preferences or normal user profiles were changed.

The optional read-only WebMCP tool was tested with an injected API interface for registration, valid execution and input rejection. A native WebMCP host was not available; normal website functionality is independent of it.

The reproducible commands are in `README.md`. Full machine-readable results and three screenshots are in `test-results/` after running the browser suite. Temporary browser profiles are excluded from the deliverable archive. The project was prepared for later static hosting and was not published online.

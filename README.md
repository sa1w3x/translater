# С УВАЖЕНИЕМ.

Russian satirical corporate translator. React 19 + Vite + Express. No account, payment, analytics, or message database.

## Run locally

Requires Node.js 22+ and npm.

```sh
npm install
npm run dev
```

Open http://localhost:3000. All 40 predefined examples work without an API key. Demo results are explicitly labelled. Custom input, tone changes, alternatives and arbitrary reverse translation require AI; the app never pretends a preset is AI-generated.

## Enable AI

**Claude:** set `ANTHROPIC_API_KEY` in `.env` (key from https://platform.claude.com/settings/keys). Optional `CLAUDE_MODEL` (default `claude-opus-5-5`; `claude-sonnet-5-5` or `claude-haiku-5-5` are cheaper). Requests use the official Anthropic SDK with low effort and server-side refusal fallback. When `ANTHROPIC_API_KEY` is set it takes priority over the OpenAI-compatible settings below.

**OpenAI-compatible:** Create `.env` using `.env.example` and set the server-only `AI_API_KEY`. Restart the server. Optional `AI_BASE_URL` points to an OpenAI-compatible `/v1` API; `AI_MODEL` defaults to `gpt-6-luna`; set `AI_MODEL=gpt-4o-mini` to use the previous model. Luna requests use `reasoning_effort=none` and `max_completion_tokens=1800`. Never use a `VITE_` prefix for secrets. The new Luna contract test (TC7) has been written but not run, and no live provider call has been verified. Earlier test results predate this migration.

## Windows .exe

```sh
npm install
npm run build:exe
```

Creates `release/s-uvazheniem.exe` (Node.js single executable, UI embedded). Run it: the app starts on http://localhost:3000 (or a free port) and opens the browser; close the console window to exit. For AI, put a `.env` with `ANTHROPIC_API_KEY` (or `AI_API_KEY`) next to the `.exe`. The build downloads the matching Windows `node.exe` from nodejs.org into `.cache/`. The exe is unsigned, so Windows SmartScreen may ask for confirmation.

## Production

```sh
npm run build
npm start
```

Deploy the repository to a Node-capable host with build command `npm ci && npm run build` and start command `npm start`. Configure `PORT` and `AI_API_KEY` in the host's secret/environment settings, and enable HTTPS. The Express server serves both API and `dist`. Static-only hosting does not provide the translation API.

Use `TRUST_PROXY=1` only behind exactly one trusted reverse proxy. The rate limit is 20 requests/minute per IP, in memory per process. Multiple replicas need a shared rate limiter. Before broad public promotion, set provider spending limits; IP throttling alone is not a global cost cap. No public deployment has been performed.

## GitHub and deployment handoff

Publication and the collaborator invitation are pending; this repository has not yet been uploaded to GitHub.

After publishing, the owner should open **Settings → Collaborators → Add people**, select **cxrtisxl**, and grant write access (the default collaborator access for a personal repository). The collaborator must accept the invitation. Hosting access is configured separately; GitHub write access alone does not grant access to a hosting account.

For deployment, cxrtisxl should connect the repository to a Node.js 22+ service, configure the build/start commands above, and add `AI_API_KEY` directly in the host's secret settings. Do not share keys through chat, source files, or commits. Set `AI_MODEL` explicitly after verifying provider access and request compatibility; the GPT-6 Luna request wiring is implemented, but its new contract test and live-provider verification are still pending.

Never publish `.env`, `.temp`, `.quadcodeai`, `.mcp.json`, credentials, or local logs. If a GitHub token was exposed in chat, revoke it at https://github.com/settings/tokens and configure replacement authentication through a secure local login or secret environment variable. Never put a token in the git remote URL.

## Privacy and sharing

History: last 30 translations in browser localStorage, removable in the History dialog. AI requests send text to the server and configured AI provider. Do not submit secrets or personal data. No application request-body logging is added. Google Fonts is an external font request.

The share card is an HTML preview: screenshot it for Stories, print/save as PDF, copy its text, or use native Web Share where supported. There is no automatic PNG export or public storage of cards. Reverse translations carry a satire disclaimer.

## Checks

```sh
npm test
npm run build
```

Five focused tests cover all 40 demo pairs, validation, mocked AI success/failure/timeout and safe local history. Browser checks cover 1440px desktop and 390px mobile, dark theme, all four modes, history restore, card preview, HR offer and stale-request protection. HTTP checks cover 200/400/403/429 responses. Saved logs: `.temp/tests.log`, `.temp/build.log`, `.temp/http-checks.log`.

Requirements: `meta/docs/respect/app_req.md`. Plan: `meta/plans/implementation.md`. Component style sample: `style-guide.html` in development.

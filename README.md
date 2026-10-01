# Fan Hub – Storyteller Web SDK demo

A small React + TypeScript app that shows a Stories row for a fictional football club (Harbourside FC), built around the public [Storyteller Web SDK](https://www.npmjs.com/package/@getstoryteller/storyteller-sdk-javascript).

**Live demo:** [https://fan-hub-xi.vercel.app/]
**Not affiliated with Storyteller.** Built from the SDK's public npm package and its bundled TypeScript types. The club and content are fictional.

## What it does

- Initialises the SDK and renders a Stories row when an API key is configured.
- Falls back to a local 9:16 Stories viewer when there is no key, initialisation fails, or it takes longer than 8 seconds. The page never breaks and never shows a blank screen.
- The fallback viewer supports tap, keyboard (arrow keys, Escape) and screen-reader labels.

## Structure

| File | Job |
| --- | --- |
| `src/storyteller/useStoryteller.ts` | Loads the SDK lazily, initialises it, returns `loading`, `ready` or `fallback` (with a reason) |
| `src/storyteller/StoriesRow.tsx` | Mounts and destroys the SDK row view in a React effect |
| `src/fallback/FallbackStories.tsx` | Local Stories viewer |

## Run it

```bash
npm install
npm run dev      # fallback viewer
npm test         # 6 unit tests
npm run build
```

To use the real SDK, copy `.env.example` to `.env` and set `VITE_STORYTELLER_API_KEY` (and optionally `VITE_STORYTELLER_CATEGORIES`). I did not have a key while building, so the SDK path is covered by unit tests with a mocked SDK, not by a live run.

## How I used AI, and how I checked it

I used an AI assistant to scaffold the project and write the first draft of the code and tests.

What I verified myself:
- Ran the app locally and on Vercel and clicked through the stories.
- Type-checked (`tsc --noEmit`), ran the tests, and ran a production build.

What the AI got wrong, and how it was caught:
- **Incomplete first delivery.** The first zip was missing six source files because a directory-creation command failed silently. Installing and running the project caught it.
- **A test that failed for the wrong reason.** One hook test failed with "bad key". The cause was in the test setup: `beforeEach(() => mock.reset())` returned the mock, and Vitest treated that return value as a cleanup function and called it after the test. I isolated it in a minimal test, then fixed the setup.

## Limitations

- No live SDK run without an API key.
- No Clips feed yet. I chose not to fake one without a key to test against.
- The SDK bundle is large (about 585 kB minified); code-splitting it would be the next improvement.
# ScribeEdge Wordcraft

ScribeEdge Wordcraft turns rough meeting notes and research excerpts into
structured summaries, decisions, action items, and open questions. It is an
offline-first workspace built for the Firebase AI Logic #BuildHybridAI 2026
hackathon.

## Live demo

- App: [scribeedge-wordcraft.lovable.app](https://scribeedge-wordcraft.lovable.app)
- Demo video: [Watch on YouTube](https://youtu.be/6IQPpqJdSmg)

## Hybrid AI architecture

Summarization follows a three-tier flow:

1. **On-device:** Chrome Built-in AI (Gemini Nano) is tried first through the
   `LanguageModel` API. Successful results show the **On-device** badge.
2. **Cloud:** If the on-device model is unavailable or fails, Firebase AI Logic
   calls `gemini-2.5-flash`. When configured with a reCAPTCHA Enterprise site
   key, Firebase App Check attests requests. Cloud results show **Cloud AI**.
3. **Offline/demo:** If cloud AI is not configured or cannot be reached, a
   deterministic local extractor produces the structured result and shows the
   **Demo** badge.

Notes and summaries are stored only in this browser's local storage. Notes sent
to the cloud fallback are processed by Firebase AI Logic; do not include
sensitive information unless that is appropriate for your Firebase project.
App Check enforcement must be enabled in the Firebase console after configuring
the provider.

## Local setup

1. Clone the repository and enter the project:

   ```sh
   git clone https://github.com/obumaviola-lang/ScribeEdge-AI.git
   cd ScribeEdge-AI
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Copy `.env.example` to `.env.local` and fill in the Firebase Web app values
   and reCAPTCHA Enterprise site key:

   ```sh
   cp .env.example .env.local
   ```

   In PowerShell, use `Copy-Item .env.example .env.local`. Register a Firebase
   Web app, enable Firebase AI Logic, and configure reCAPTCHA Enterprise in
   Firebase App Check. The keys are client-side configuration, not private
   server credentials. Never put a reCAPTCHA secret or debug token in this file.
   The Firebase and App Check settings are optional: without them, the app still
   tries on-device inference and then the local Demo fallback.

4. Start the development server:

   ```sh
   npm run dev
   ```

5. To try the on-device tier, use a supported, up-to-date Chrome desktop
   browser. Open `chrome://flags/#prompt-api-for-gemini-nano-multimodal-input`,
   enable **Prompt API for Gemini Nano**, and restart Chrome. The first use may
   need to download the Gemini Nano model. If the flag or model is unavailable,
   the app automatically uses Firebase AI Logic when configured, then Demo.

For local development with App Check, the app enables Firebase's debug-token
support on localhost. Safelist the token shown in the browser console in the
Firebase console under **App Check > Apps > Manage debug tokens**. Keep the
token private and do not use it in production.

## Build

```sh
npm run build
npm run preview
```

## License

ScribeEdge Wordcraft is licensed under Apache-2.0. See [LICENSE](./LICENSE).

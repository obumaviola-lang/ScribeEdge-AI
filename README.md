# ScribeEdge AI

ScribeEdge AI turns rough notes, meeting minutes, and research excerpts into a
concise summary with decisions, action items, and open questions. It is an
offline-first workspace for the #BuildHybridAI hackathon, built with vanilla
JavaScript and Firebase AI Logic.

## Why ScribeEdge

Notes often capture everything except what needs to happen next. ScribeEdge
helps people move from unstructured information to useful follow-through while
keeping private content on the device whenever possible. Notes are saved in
this browser on this device and can be removed with the Clear button.

## Live app

The app is hosted on [Lovable](https://scribeedge-wordcraft.lovable.app/).

## How it works

1. Paste notes into the workspace and choose **Summarize with Hybrid AI**.
2. With Firebase configured, the app initializes the browser's on-device model
   after the user action, then asks Firebase AI Logic to summarize the text.
3. With `InferenceMode.PREFER_ON_DEVICE`, Firebase uses Chrome's on-device
   Prompt API when it is available and ready. Otherwise, Firebase routes the
   request to its configured cloud model.
4. The response's `inferenceSource` is logged in the browser console and shown
   in the result badge as **On-device** or **Cloud**.
5. Without Firebase configuration, Chrome's Built-in AI `LanguageModel` API is
   used directly when available; this mode stays on-device.

The app also caches its production app shell with a service worker. After the
first successful visit, the interface can load offline; on-device inference
can also work offline once Chrome's model is available. Cloud fallback requires
an internet connection.

### Browser and SDK support

Firebase AI Logic's hybrid on-device inference for Web requires Firebase JS SDK
**12.5.0 or later** and Chrome on desktop **139 or later**. Chrome may require
enabling `chrome://flags/#prompt-api-for-gemini-nano-multimodal-input`; the
model may also need to download before the first local inference. Other
browsers and unsupported devices use cloud inference when connected.

The package uses Firebase `^12.5.0` rather than the older `^11.0.0` range:
Firebase documents Web hybrid inference and response-source reporting as
available starting in v12.5.0, so v11 cannot provide the requested behavior.

## Set up

### Prerequisites

- Node.js 18 or later and npm
- A Firebase project with Firebase AI Logic enabled and a Gemini API provider
  configured
- A reCAPTCHA v3 site key registered for your production domain

### Install and configure

```sh
npm install
```

Copy `.env.example` to `.env.local` and fill in the Firebase Web app settings
and reCAPTCHA v3 site key for local development. For the hosted Lovable app,
set the same `VITE_*` values in the Lovable project's environment settings and
redeploy:

```dotenv
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_RECAPTCHA_SITE_KEY=your-recaptcha-v3-site-key
```

These are client-side Firebase configuration values, not server credentials.
Do not put a reCAPTCHA secret key or any other private credential in the
browser app.
The app can run Firebase AI without a reCAPTCHA site key, but App Check won't
be initialized. Replace the demo placeholder and enable App Check before
enforcing it in production.

Notes are saved in this browser on this device and can be cleared with the
Clear button. Firebase and reCAPTCHA configuration are optional for local
development. Without Firebase, the app uses Chrome Built-in AI when available;
otherwise, note editing and local storage still work in demo mode.

In the Firebase console:

1. Register a Web app and enable Firebase AI Logic for the project.
2. Register the reCAPTCHA v3 site key with Firebase App Check, and enable App
   Check enforcement for Firebase AI Logic before releasing the app.
3. Add `scribeedge-wordcraft.lovable.app` to the reCAPTCHA site's allowed
   domains.

### Run locally

```sh
npm run dev
```

Open the localhost URL printed by Vite. In local development, the app enables
the App Check debug token before initializing App Check. Copy the token printed
in the browser console and safelist it for your app in **Firebase console >
App Check > Apps > Manage debug tokens**. Keep this debug token private; do not
ship it or enable debug mode in production.

### Build and preview

```sh
npm run build
npm run preview
```

Serve the production build over HTTPS (or localhost during development) to use
the service worker and production App Check provider.

## Privacy and production notes

- Notes are saved in this browser's local storage; generated summaries remain
  in page memory only. There is no application database or cloud note storage.
- On-device requests stay on the device. When the local model is unavailable
  or not ready, Firebase's hybrid SDK can send note text to the configured
  cloud model. The inference badge identifies which route handled the response.
- Configure and enforce Firebase App Check for production. The development
  debug token is not a production attestation provider.
- This project does not include authentication or server-side authorization;
  configure Firebase quotas and any additional access controls appropriate to
  your deployment.

## License

ScribeEdge AI is available under the Apache-2.0 License. See [LICENSE](./LICENSE).

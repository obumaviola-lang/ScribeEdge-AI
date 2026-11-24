import { initializeApp } from "firebase/app";
import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider
} from "firebase/app-check";
import {
  getAI,
  getGenerativeModel,
  GoogleAIBackend
} from "firebase/ai";

declare global {
  interface Window {
    FIREBASE_APPCHECK_DEBUG_TOKEN?: boolean | string;
  }
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

function isConfiguredValue(value: unknown): value is string {
  return typeof value === "string" &&
    value.trim().length > 0 &&
    !/^(your[-_]|replace[-_]|dummy|placeholder)/i.test(value.trim());
}

export function initializeFirebaseAI() {
  const configured = Object.values(firebaseConfig).every(isConfiguredValue);
  if (!configured) {
    return {
      model: null,
      configured: false,
      appCheckEnabled: false,
      error: null
    };
  }

  try {
    const app = initializeApp(firebaseConfig);
    const appCheckEnabled = isConfiguredValue(recaptchaSiteKey);

    if (appCheckEnabled) {
      const isLocalhost =
        import.meta.env.DEV &&
        ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
      if (isLocalhost && typeof self.FIREBASE_APPCHECK_DEBUG_TOKEN === "undefined") {
        self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
      }

      initializeAppCheck(app, {
        provider: new ReCaptchaEnterpriseProvider(recaptchaSiteKey),
        isTokenAutoRefreshEnabled: true
      });
    }

    const ai = getAI(app, { backend: new GoogleAIBackend() });
    const model = getGenerativeModel(ai, { model: "gemini-2.5-flash" });
    return { model, configured: true, appCheckEnabled, error: null };
  } catch (error) {
    return {
      model: null,
      configured: true,
      appCheckEnabled: false,
      error
    };
  }
}

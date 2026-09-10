import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore, doc, getDocFromServer } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

export interface FirebaseConfigParams {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// Check environment variables first
const metaEnv = (import.meta as any).env || {};
const envConfig: FirebaseConfigParams = {
  apiKey: metaEnv.VITE_FIREBASE_API_KEY || '',
  authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: metaEnv.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: metaEnv.VITE_FIREBASE_APP_ID || '',
};

// Check localStorage for manually entered config
function getStoredConfig(): FirebaseConfigParams | null {
  try {
    const raw = localStorage.getItem('ea_firebase_config');
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // Ignore storage parse error
  }
  return null;
}

const activeConfig: FirebaseConfigParams = getStoredConfig() || envConfig;

export const isFirebaseConfigured = Boolean(
  activeConfig.apiKey &&
  activeConfig.projectId &&
  activeConfig.apiKey !== 'your-api-key' &&
  !activeConfig.apiKey.includes('MY_')
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

if (isFirebaseConfigured) {
  try {
    if (!getApps().length) {
      app = initializeApp(activeConfig);
    } else {
      app = getApps()[0];
    }
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  } catch (err) {
    console.warn('Firebase initialization error, switching to local offline persistence:', err);
  }
}

export { app, auth, db, storage, activeConfig };

export async function verifyFirestoreConnection(): Promise<boolean> {
  if (!db) return false;
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore offline / client offline.');
    }
    return false;
  }
}

export function saveFirebaseConfig(cfg: FirebaseConfigParams) {
  localStorage.setItem('ea_firebase_config', JSON.stringify(cfg));
  window.location.reload();
}

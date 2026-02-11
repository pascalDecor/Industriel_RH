/**
 * Configuration API - utilise les variables d'environnement
 * Variables requises : NEXT_PUBLIC_APP_URL (obligatoire en production)
 */

const isProd = process.env.NODE_ENV === "production";

// Valeurs par défaut (fallback pour la rétrocompatibilité)
const DEFAULT_PROD_APP_URL = "https://industriellerh.com";
const DEFAULT_DEV_APP_URL = "http://localhost:3000";
const DEFAULT_USER_AVATAR =
  "https://cdn3d.iconscout.com/3d/premium/thumb/man-avatar-3d-icon-download-in-png-blend-fbx-gltf-file-formats--men-people-male-pack-avatars-icons-5187871.png?f=webp";

const appUrl =
  process.env.NEXT_PUBLIC_APP_URL ||
  (isProd ? DEFAULT_PROD_APP_URL : DEFAULT_DEV_APP_URL);

const apiBaseUrl = `${appUrl}/api`;
const apiBaseWithoutProtocolValue = (() => {
  try {
    return new URL(appUrl).host;
  } catch {
    return isProd ? "industriellerh.com" : "localhost:3000";
  }
})();

/** True lorsque l'URL de l'app est sur un domaine Vercel (*.vercel.app) */
export const isVercel = apiBaseWithoutProtocolValue.endsWith(".vercel.app");

/** Endpoint d'upload : /api/upload_vercel sur Vercel, /api/upload ailleurs */
export const uploadApiURL = apiBaseUrl + (isVercel ? "/upload_vercel" : "/upload");

export const apiBaseURL = apiBaseUrl;
export const baseApiURL: string = apiBaseUrl;
export const apiBase: string = appUrl;
export const apiBaseWithoutProtocol: string = apiBaseWithoutProtocolValue;

export const userAvatarURL: string =
  process.env.NEXT_PUBLIC_USER_AVATAR_URL || DEFAULT_USER_AVATAR;

/** @deprecated Utiliser userAvatarURL */
export const userAvartarURL = userAvatarURL;

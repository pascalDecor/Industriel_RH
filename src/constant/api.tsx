/**
 * Configuration API - utilise les variables d'environnement
 * Variables requises : NEXT_PUBLIC_APP_URL (obligatoire en production)
 */

const isProd = process.env.NODE_ENV === "production";

// Valeurs par défaut (fallback pour la rétrocompatibilité)
const DEFAULT_PROD_APP_URL = "https://industriel-rh.vercel.app";
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
    return isProd ? "industriel-rh.vercel.app" : "localhost:3000";
  }
})();

export const apiBaseURL = apiBaseUrl;
export const baseApiURL: string = apiBaseUrl;
export const apiBase: string = appUrl;
export const apiBaseWithoutProtocol: string = apiBaseWithoutProtocolValue;

export const userAvatarURL: string =
  process.env.NEXT_PUBLIC_USER_AVATAR_URL || DEFAULT_USER_AVATAR;

/** @deprecated Utiliser userAvatarURL */
export const userAvartarURL = userAvatarURL;

"use server";

import crypto from "crypto";

/**
 * Génère un mot de passe temporaire sécurisé
 */
export async function generateSecurePassword(): Promise<string> {
  // Caractères utilisables (exclut les caractères ambigus comme 0, O, l, I)
  const lowercase = "abcdefghijkmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const numbers = "23456789";
  const symbols = "!@#$%&*";

  const allChars = lowercase + uppercase + numbers + symbols;

  let password = "";

  // Garantir au moins 1 caractère de chaque type
  password += getRandomChar(lowercase);
  password += getRandomChar(uppercase);
  password += getRandomChar(numbers);
  password += getRandomChar(symbols);

  // Compléter avec des caractères aléatoires (12 caractères au total)
  for (let i = 4; i < 12; i++) {
    password += getRandomChar(allChars);
  }

  // Mélanger le mot de passe pour éviter les patterns prévisibles
  return shuffleString(password);
}

/**
 * Génère un token sécurisé pour la première connexion
 */
export async function generateFirstLoginToken(): Promise<string> {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Calcule la date d'expiration du mot de passe temporaire (48h)
 */
export async function getTempPasswordExpiration(): Promise<Date> {
  const expiration = new Date();
  expiration.setHours(expiration.getHours() + 48);
  return expiration;
}

/**
 * Calcule la date d'expiration du token de première connexion (7 jours)
 */
export async function getFirstLoginTokenExpiration(): Promise<Date> {
  const expiration = new Date();
  expiration.setDate(expiration.getDate() + 7);
  return expiration;
}

/**
 * Vérifie si un mot de passe temporaire a expiré
 */
export async function isTempPasswordExpired(expirationDate: Date | null): Promise<boolean> {
  if (!expirationDate) return false;
  return new Date() > expirationDate;
}

/**
 * Vérifie si un token de première connexion a expiré
 */
export async function isFirstLoginTokenExpired(expirationDate: Date | null): Promise<boolean> {
  if (!expirationDate) return false;
  return new Date() > expirationDate;
}

// Fonctions utilitaires privées

function getRandomChar(chars: string): string {
  const randomIndex = crypto.randomInt(0, chars.length);
  return chars[randomIndex];
}

function shuffleString(str: string): string {
  const arr = str.split("");
  for (let i = arr.length - 1; i > 0; i--) {
    const j = crypto.randomInt(0, i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join("");
}
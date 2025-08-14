/**
 * Valide la force d'un mot de passe
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  score: number;
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;

  // Longueur minimale
  if (password.length < 8) {
    feedback.push('Le mot de passe doit contenir au moins 8 caractères');
  } else {
    score += 1;
  }

  // Caractères minuscules
  if (!/[a-z]/.test(password)) {
    feedback.push('Ajoutez au moins une lettre minuscule');
  } else {
    score += 1;
  }

  // Caractères majuscules
  if (!/[A-Z]/.test(password)) {
    feedback.push('Ajoutez au moins une lettre majuscule');
  } else {
    score += 1;
  }

  // Chiffres
  if (!/\d/.test(password)) {
    feedback.push('Ajoutez au moins un chiffre');
  } else {
    score += 1;
  }

  // Caractères spéciaux
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    feedback.push('Ajoutez au moins un caractère spécial');
  } else {
    score += 1;
  }

  // Longueur recommandée
  if (password.length >= 12) {
    score += 1;
  }

  return {
    isValid: score >= 4,
    score,
    feedback
  };
}
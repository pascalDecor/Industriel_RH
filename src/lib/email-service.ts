"use server";

import { UserRole, ROLE_LABELS } from "@/types/auth";
import { sendMail } from "@/lib/mail";
import { apiBase } from "@/constant/api";

/**
 * Interface pour les données d'email de bienvenue
 */
interface WelcomeEmailData {
  name: string;
  email: string;
  role: UserRole;
  tempPassword: string;
  firstLoginToken: string;
  companyName?: string;
}

/**
 * Envoie un email de bienvenue avec les identifiants temporaires
 */
export async function sendWelcomeEmail(
  data: WelcomeEmailData
): Promise<boolean> {
  try {
    const companyName = process.env.EMAIL_FROM_NAME || "Industriel RH";
    const subject = `Bienvenue chez ${companyName} - Vos identifiants de connexion`;
    const htmlContent = generateWelcomeEmailHTML(data);
    const textContent = generateWelcomeEmailText(data);

    // Utiliser la fonction sendMail existante
    const emailSent = await sendMail(
      data.email,
      subject,
      textContent,
      htmlContent
    );

    if (emailSent) {
      console.log(`✅ Email de bienvenue envoyé avec succès à ${data.email}`);
    } else {
      console.error(`❌ Échec de l'envoi de l'email à ${data.email}`);

      // Log de debug en cas d'échec
      console.log("📧 INFORMATIONS POUR DEBUG:");
      console.log("==================================");
      console.log(`À: ${data.email}`);
      console.log(`Nom: ${data.name}`);
      console.log(`Rôle: ${ROLE_LABELS[data.role]}`);
      console.log(`Mot de passe temporaire: ${data.tempPassword}`);
      console.log(`Token de première connexion: ${data.firstLoginToken}`);
      console.log("==================================");
    }

    return emailSent;
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email de bienvenue:", error);
    return false;
  }
}

/**
 * Génère le contenu HTML de l'email de bienvenue
 */
/**
 * Génère le contenu texte de l'email de bienvenue (fallback)
 */
function generateWelcomeEmailText(data: WelcomeEmailData): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || apiBase;
  const firstLoginUrl = `${baseUrl}/auth/first-login?token=${data.firstLoginToken}`;
  const companyName = process.env.EMAIL_FROM_NAME || "Industriel RH";

  return `
Bienvenue ${data.name} !

Votre compte a été créé avec le rôle : ${ROLE_LABELS[data.role]}

VOS IDENTIFIANTS DE CONNEXION :
Email de connexion : ${data.email}
Mot de passe temporaire : ${data.tempPassword}

PREMIÈRE CONNEXION :
Cliquez sur ce lien pour vous connecter : ${firstLoginUrl}

IMPORTANT - SÉCURITÉ :
• Ce mot de passe temporaire expire dans 48 heures
• Vous devrez créer un nouveau mot de passe lors de votre première connexion
• Ne partagez jamais vos identifiants avec qui que ce soit
• Ce lien de première connexion expire dans 7 jours

PROCHAINES ÉTAPES :
1. Cliquez sur le lien de connexion ci-dessus
2. Utilisez vos identifiants temporaires pour vous connecter
3. Créez un nouveau mot de passe sécurisé
4. Explorez votre espace de travail !

Cet email a été envoyé automatiquement par ${companyName}.
Si vous avez des questions, contactez votre administrateur.
  `.trim();
}

/**
 * Génère le contenu HTML de l'email de bienvenue
 */
function generateWelcomeEmailHTML(data: WelcomeEmailData): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || apiBase;
  const firstLoginUrl = `${baseUrl}/auth/first-login?token=${data.firstLoginToken}`;
  const companyName = process.env.EMAIL_FROM_NAME || "Industriel RH";

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenue chez ${companyName}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8fafc;
        }
        .container {
            background: white;
            border-radius: 12px;
            padding: 32px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 24px;
            margin-bottom: 32px;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #1f2937;
        }
        .welcome-title {
            color: #059669;
            font-size: 28px;
            font-weight: bold;
            margin: 0 0 8px 0;
        }
        .subtitle {
            color: #6b7280;
            font-size: 16px;
            margin: 0;
        }
        .credentials-box {
            background: #f0f9ff;
            border: 2px solid #0ea5e9;
            border-radius: 8px;
            padding: 24px;
            margin: 24px 0;
        }
        .credentials-title {
            color: #0369a1;
            font-weight: bold;
            font-size: 18px;
            margin: 0 0 16px 0;
        }
        .credential-item {
            margin: 12px 0;
        }
        .credential-label {
            font-weight: 600;
            color: #374151;
        }
        .credential-value {
            font-family: 'Courier New', monospace;
            background: #ffffff;
            padding: 8px 12px;
            border-radius: 4px;
            border: 1px solid #d1d5db;
            font-size: 14px;
            margin-top: 4px;
            display: inline-block;
            min-width: 200px;
        }
        .cta-button {
            display: inline-block;
            background: #059669;
            color: white;
            padding: 14px 28px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            margin: 24px 0;
            text-align: center;
        }
        .cta-button:hover {
            background: #047857;
        }
        .security-notice {
            background: #fef3c7;
            border: 2px solid #f59e0b;
            border-radius: 8px;
            padding: 16px;
            margin: 24px 0;
        }
        .security-title {
            color: #92400e;
            font-weight: bold;
            margin: 0 0 8px 0;
        }
        .security-text {
            color: #451a03;
            font-size: 14px;
            margin: 0;
        }
        .footer {
            text-align: center;
            border-top: 1px solid #e5e7eb;
            padding-top: 24px;
            margin-top: 32px;
            color: #6b7280;
            font-size: 14px;
        }
        .role-badge {
            display: inline-block;
            background: #dbeafe;
            color: #1e40af;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 500;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">${companyName}</div>
        </div>
        
        <h1 class="welcome-title">Bienvenue ${data.name} !</h1>
        <p class="subtitle">Votre compte a été créé avec le rôle : <span class="role-badge">${
          ROLE_LABELS[data.role]
        }</span></p>
        
        <div class="credentials-box">
            <h2 class="credentials-title">🔐 Vos identifiants de connexion</h2>
            
            <div class="credential-item">
                <div class="credential-label">Email de connexion :</div>
                <div class="credential-value">${data.email}</div>
            </div>
            
            <div class="credential-item">
                <div class="credential-label">Mot de passe temporaire :</div>
                <div class="credential-value">${data.tempPassword}</div>
            </div>
        </div>
        
        <div style="text-align: center;">
            <a href="${firstLoginUrl}" class="cta-button" style="color: white; text-decoration: none;">
               Se connecter maintenant
            </a>
        </div>
        
        <div class="security-notice">
            <h3 class="security-title">⚠️ Important - Sécurité</h3>
            <p class="security-text">
                • Ce mot de passe temporaire expire dans <strong>48 heures</strong><br>
                • Vous devrez créer un nouveau mot de passe lors de votre première connexion<br>
                • Ne partagez jamais vos identifiants avec qui que ce soit<br>
                • Ce lien de première connexion expire dans <strong>7 jours</strong>
            </p>
        </div>
        
        <div style="margin: 32px 0; padding: 20px; background: #f9fafb; border-radius: 8px;">
            <h3 style="color: #374151; margin: 0 0 12px 0;">🎯 Prochaines étapes :</h3>
            <ol style="color: #6b7280; margin: 0; padding-left: 20px;">
                <li>Cliquez sur le bouton "Se connecter maintenant" ci-dessus</li>
                <li>Utilisez vos identifiants temporaires pour vous connecter</li>
                <li>Créez un nouveau mot de passe sécurisé</li>
                <li>Explorez votre espace de travail !</li>
            </ol>
        </div>
        
        <div class="footer">
            <p>Cet email a été envoyé automatiquement par ${companyName}.</p>
            <p>Si vous avez des questions, contactez votre administrateur.</p>
            <p style="margin-top: 16px; font-size: 12px; color: #9ca3af;">
                Email généré le ${new Date().toLocaleDateString(
                  "fr-FR"
                )} à ${new Date().toLocaleTimeString("fr-FR")}
            </p>
        </div>
    </div>
</body>
</html>
  `;
}

/**
 * Envoie un email de rappel pour mot de passe expiré
 */
export async function sendPasswordExpiredEmail(
  userEmail: string,
  userName: string
): Promise<boolean> {
  try {
    const subject = "Mot de passe temporaire expiré";
    const textContent = `Bonjour ${userName},\n\nVotre mot de passe temporaire a expiré. Contactez votre administrateur pour obtenir un nouveau lien de première connexion.`;

    return await sendMail(userEmail, subject, textContent);
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email de rappel:", error);
    return false;
  }
}

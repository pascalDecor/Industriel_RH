import nodemailer from "nodemailer";

// Fonction utilitaire pour ajouter un délai
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Fonction pour convertir le contenu EditorJS en HTML
const convertEditorJSToHTML = (content: string) => {
  try {
    const data = JSON.parse(content);
    if (!data.blocks || !Array.isArray(data.blocks)) {
      return content; // Si ce n'est pas du JSON EditorJS, retourner tel quel
    }

    return data.blocks.map((block: any) => {
      switch (block.type) {
        case 'header':
          const level = block.data.level || 2;
          return `<h${level}>${block.data.text || ''}</h${level}>`;
        case 'paragraph':
          return `<p>${block.data.text || ''}</p>`;
        case 'list':
          const items = block.data.items?.map((item: any) => {
            // Handle both string items and object items with content property
            const content = typeof item === 'string' ? item : (item.content || '');
            return `<li>${content}</li>`;
          }).join('') || '';
          return block.data.style === 'ordered'
            ? `<ol>${items}</ol>`
            : `<ul>${items}</ul>`;
        case 'quote':
          return `<blockquote style="border-left: 4px solid #ddd; margin: 16px 0; padding-left: 16px; font-style: italic;">${block.data.text || ''}</blockquote>`;
        case 'code':
          return `<pre style="background: #f4f4f4; padding: 12px; border-radius: 4px; overflow-x: auto;"><code>${block.data.code || ''}</code></pre>`;
        case 'image':
          const img = block.data.file?.url ?
            `<img src="${block.data.file.url}" alt="${block.data.caption || ''}" style="max-width: 100%; height: auto; display: block; margin: 10px auto;" />` : '';
          const caption = block.data.caption ? `<p style="text-align: center; font-style: italic; color: #666; font-size: 14px; margin: 5px 0 20px 0;"><em>${block.data.caption}</em></p>` : '';
          return `<div style="text-align: center; margin: 20px 0;">${img}${caption}</div>`;
        default:
          return `<p>${block.data.text || ''}</p>`;
      }
    }).join('');
  } catch (e) {
    // Si le parsing JSON échoue, traiter comme du texte normal
    return content.replace(/\n/g, '<br>');
  }
};

// Fonction pour générer le HTML des templates
const generateEmailTemplate = (templateId: string, content: string, subject: string, title: string) => {
  const baseStyles = `
    font-family: Arial, sans-serif;
    line-height: 1.6;
    color: #333;
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
  `;

  const htmlContent = convertEditorJSToHTML(content);

  switch (templateId) {
    case 'newsletter':
      return `
        <div style="${baseStyles}">
          <header style="text-align: center; border-bottom: 2px solid #0066cc; padding-bottom: 20px; margin-bottom: 30px;">
            <h1 style="color: #0066cc; margin: 0; font-size: 24px;">📰 ${title}</h1>
            <p style="color: #666; margin: 10px 0 0 0; font-size: 14px;">Newsletter Industriel RH</p>
          </header>
          <main style="margin-bottom: 30px;">
            <h2 style="color: #0066cc; font-size: 20px;">${subject}</h2>
            <div>${htmlContent}</div>
          </main>
          <footer style="border-top: 1px solid #ddd; padding-top: 20px; text-align: center; color: #666; font-size: 12px;">
            <p>© ${new Date().getFullYear()} Industriel RH. Tous droits réservés.</p>
            <p>Si vous ne souhaitez plus recevoir nos emails, <a href="#" style="color: #0066cc;">cliquez ici</a>.</p>
          </footer>
        </div>
      `;

    case 'announcement':
      return `
        <div style="${baseStyles}">
          <header style="background: linear-gradient(135deg, #ff6b35, #f7931e); color: white; padding: 30px; text-align: center; border-radius: 8px; margin-bottom: 30px;">
            <h1 style="margin: 0; font-size: 28px;">📢 ${title}</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Annonce importante</p>
          </header>
          <main style="margin-bottom: 30px;">
            <h2 style="color: #ff6b35; font-size: 22px;">${subject}</h2>
            <div style="background: #f9f9f9; padding: 20px; border-radius: 6px; border-left: 4px solid #ff6b35;">
              <div>${htmlContent}</div>
            </div>
          </main>
          <footer style="border-top: 1px solid #ddd; padding-top: 20px; text-align: center; color: #666; font-size: 12px;">
            <p>© ${new Date().getFullYear()} Industriel RH. Tous droits réservés.</p>
          </footer>
        </div>
      `;

    case 'basic':
    default:
      return `
        <div style="${baseStyles}">
          <header style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333; margin: 0; font-size: 24px;">📄 ${title}</h1>
          </header>
          <main style="margin-bottom: 30px;">
            <h2 style="color: #333; font-size: 20px;">${subject}</h2>
            <div>${htmlContent}</div>
          </main>
          <footer style="border-top: 1px solid #ddd; padding-top: 20px; text-align: center; color: #666; font-size: 12px;">
            <p>© ${new Date().getFullYear()} Industriel RH.</p>
          </footer>
        </div>
      `;
  }
};


const isGmail = () => (process.env.EMAIL_HOST || "").includes("gmail.com");

// Créer une nouvelle instance de transporter pour chaque envoi pour éviter les connexions persistantes
const createTransporter = () => {
  const host = process.env.EMAIL_HOST || "mail.industriellerh.com";
  const port = parseInt(process.env.EMAIL_PORT || "587");
  const useSecure = port === 465;

  return nodemailer.createTransport({
    host,
    port,
    secure: useSecure,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: true,
    },
  });
};

// Fonction pour envoyer à un seul destinataire
export const sendSingleMail = async (
  to: string,
  subject: string,
  text: string,
  html?: string,
  templateData?: { templateId?: string, title?: string, content?: string },
  retryCount = 0
): Promise<boolean> => {
  const maxRetries = 3;
  const baseDelay = 5000; // 5 secondes de base (plus long)

  try {
    // Ajouter un délai progressif en cas de retry
    if (retryCount > 0) {
      const delayTime = baseDelay * Math.pow(2, retryCount - 1); // Délai exponentiel
      console.log(`⏱️ Attente de ${delayTime}ms avant retry ${retryCount}...`);
      await delay(delayTime);
    }

    // Générer le HTML du template si les données sont fournies
    let finalHtml = html;
    if (templateData?.templateId && templateData.content && templateData.title) {
      finalHtml = generateEmailTemplate(
        templateData.templateId,
        templateData.content,
        subject,
        templateData.title
      );
    }

    // Créer une nouvelle instance de transporter pour chaque envoi
    const transporter = createTransporter();

    try {
      await transporter.sendMail({
        from: `${process.env.EMAIL_FROM_NAME || 'Industriel RH'} <${process.env.EMAIL_USER}>`,
        to: to, // Un seul destinataire
        subject,
        text,
        html: finalHtml
      });

      console.log(`✅ Email envoyé avec succès à: ${to}`);
      return true;

    } finally {
      // Fermer explicitement la connexion
      transporter.close();
    }

  } catch (error: any) {
    console.error(`❌ Erreur lors de l'envoi de l'email (tentative ${retryCount + 1}):`, error?.message || error);

    // Vérifier si c'est une erreur de connexions multiples
    if (error?.response?.includes('Too many concurrent') || error?.response?.includes('421')) {
      if (retryCount < maxRetries) {
        console.log(`🔄 Retry ${retryCount + 1}/${maxRetries} en raison de la limitation de connexions...`);
        // Attendre plus longtemps avant le retry
        await delay(10000); // 10 secondes supplémentaires
        return sendSingleMail(to, subject, text, html, templateData, retryCount + 1);
      } else {
        console.error(`❌ Échec après ${maxRetries} tentatives pour ${to}`);
        return false;
      }
    }

    // Pour d'autres erreurs, essayer la configuration SSL alternative (port 465) si on était sur 587
    const host = process.env.EMAIL_HOST || "mail.industriellerh.com";
    const port = parseInt(process.env.EMAIL_PORT || "587");
    const shouldTryFallback = retryCount === 0 && port !== 465;

    if (shouldTryFallback) {
      console.log("🔄 Tentative avec configuration SSL alternative (port 465)...");
      try {
        const fallbackTransporter = nodemailer.createTransport({
          host,
          port: 465,
          secure: true,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
          tls: {
            rejectUnauthorized: false,
          },
        } as any);

        try {
          await fallbackTransporter.sendMail({
            from: `${process.env.EMAIL_FROM_NAME || "Industriel RH"} <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html: templateData?.templateId && templateData?.content && templateData?.title
              ? generateEmailTemplate(templateData.templateId, templateData.content, subject, templateData.title)
              : html,
          });

          console.log(`✅ Email envoyé avec succès via fallback à ${to}`);
          return true;
        } finally {
          fallbackTransporter.close();
        }

      } catch (fallbackError: any) {
        console.error("❌ Erreur avec configuration fallback:", fallbackError?.message || fallbackError);
        return false;
      }
    }

    return false;
  }
};

// Fonction principale qui gère l'envoi multiple en appelant sendSingleMail individuellement
export const sendMail = async (
  to: string | string[],
  subject: string,
  text: string,
  html?: string,
  templateData?: { templateId?: string, title?: string, content?: string }
): Promise<boolean> => {
  // Si c'est un seul destinataire
  if (typeof to === 'string') {
    return await sendSingleMail(to, subject, text, html, templateData);
  }

  // Si c'est un tableau de destinataires, envoyer individuellement
  const recipients = to;
  let successCount = 0;
  let errorCount = 0;

  for (const recipient of recipients) {
    try {
      console.log(`📧 Envoi individuel à: ${recipient}`);
      const success = await sendSingleMail(recipient, subject, text, html, templateData);

      if (success) {
        successCount++;
      } else {
        errorCount++;
      }

      // Petite pause entre chaque envoi pour éviter de surcharger le serveur
      await delay(1000); // 1 seconde entre chaque email

    } catch (error) {
      console.error(`❌ Erreur lors de l'envoi à ${recipient}:`, error);
      errorCount++;
    }
  }

  console.log(`📊 Résultat envoi: ${successCount} succès, ${errorCount} échecs sur ${recipients.length} destinataires`);

  // Retourner true si au moins un email a été envoyé avec succès
  return successCount > 0;
};

import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
  host: "mail.industriellerh.com", 
  port: 465,                         // 465 pour SSL, ou 587 pour TLS
  secure: true,                  
  auth: {
    user: process.env.EMAIL_USER,     
    pass: process.env.EMAIL_PASS,    
  },
});

export const sendMail = async (to: string, subject: string, text: string) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text
    });
    console.log("Email envoyé avec succès");
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email", error);
  }
};

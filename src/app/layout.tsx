import type { Metadata } from "next";

import "../css/globals.css";
import { Plus_Jakarta_Sans } from "next/font/google";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { RecaptchaProvider } from "@/contexts/RecaptchaContext";
import CookieConsent from "@/components/CookieConsent";


const plus_Jakarta_Sans = Plus_Jakarta_Sans({
  variable: "--font-Plus-Jakarta-Sans",
  subsets: ["latin"],
});

const appUrl =
  process.env.NEXT_PUBLIC_APP_URL || "https://industriel-rh.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "Industrielle RH | Recrutement et solutions RH au Québec",
    template: "Industrielle RH et recrutement",
  },
  description:
    "Industrielle RH accompagne les entreprises et les candidats avec des solutions de recrutement, d'embauche et de conseil en ressources humaines au Québec.",
  keywords: ["recrutement", "RH", "emploi", "Québec", "ressources humaines", "Industrielle RH"],
  icons: {
    icon: "/images/logo_icone.png",
    apple: "/images/logo_icone.png",
  },
  openGraph: {
    locale: "fr_CA",
    type: "website",
    images: [
      {
        url: "/images/logo.png",
        width: 1200,
        height: 630,
        alt: "Industrielle RH",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" >
          <body className={`${plus_Jakarta_Sans.className} antialiased text-black`} style={{
            maxWidth: "100vw",
            width: "100vw",
            overflowX: "hidden",
            backgroundColor: "#fff"
          }}>
            <RecaptchaProvider>
              <LanguageProvider>
                {children}
                <CookieConsent />
              </LanguageProvider>
            </RecaptchaProvider>
          </body>
    </html>
  );
}

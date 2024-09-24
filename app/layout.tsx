export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { Inter, IBM_Plex_Serif } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const ibmPlexSerif = IBM_Plex_Serif({
   subsets: ["latin"],
   weight: ["400", "700"],
   variable: "--font-ibm-plex-serif",
});

export const metadata: Metadata = {
   title: "Auralis",
   description: "Auralis is a modern banking platform for everyone.",
   icons: {
      icon: "/img/logo-bank.png",
   },
};

export default function MainLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="fr">
         <body className={`${inter.variable} ${ibmPlexSerif.variable}`}>
            {children}
         </body>
      </html>
   );
}

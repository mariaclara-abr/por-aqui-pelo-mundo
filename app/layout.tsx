import type { Metadata } from "next";
import { Fraunces, Inter, Lora } from "next/font/google";
import { AuthProvider } from "@/lib/auth";
import { RoteiroProvider } from "@/lib/roteiro";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE_NAME, SITE_URL, buildOpenGraph } from "@/lib/metadata";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
});

const HOME_TITLE = "Roteiros de viagem em família feitos por quem esteve lá";
const HOME_DESCRIPTION =
  "Roteiros e dicas de Disney, Europa, Dubai e Brasil, visitados e avaliados pessoalmente por Rejane Abrantes. Viagem com crianças e casal, sem lista genérica.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: `%s | ${SITE_NAME}`,
    default: HOME_TITLE,
  },
  description: HOME_DESCRIPTION,
  openGraph: buildOpenGraph({
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
  }),
  twitter: {
    card: "summary_large_image",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${fraunces.variable} ${inter.variable} ${lora.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <AuthProvider>
          <RoteiroProvider>
            <Header />
            {children}
            <Footer />
          </RoteiroProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

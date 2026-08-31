import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { AuthProvider } from "@/lib/auth";
import { RoteiroProvider } from "@/lib/roteiro";
import { NotificationsProvider } from "@/lib/notifications-context";
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

const HOME_TITLE = "Roteiros de viagem com curadoria de quem esteve lá";
const HOME_DESCRIPTION =
  "Monte seu roteiro de viagem com atrações visitadas e avaliadas pessoalmente por Rejane Abrantes. Recomendações reais para famílias, sem lista genérica.";

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
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${fraunces.variable} ${inter.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <AuthProvider>
          <RoteiroProvider>
            <NotificationsProvider>
              <Header />
              {children}
              <Footer />
            </NotificationsProvider>
          </RoteiroProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { AuthProvider } from "@/lib/auth";
import { RoteiroProvider } from "@/lib/roteiro";
import Header from "@/components/Header";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Por Aqui Pelo Mundo",
  description: "Planejamento de viagens baseado em curadoria humana.",
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
            <Header />
            {children}
          </RoteiroProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

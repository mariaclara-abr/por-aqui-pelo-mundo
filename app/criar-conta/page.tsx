import type { Metadata } from "next";
import Link from "next/link";
import AuthCard from "@/components/AuthCard";
import SignupForm from "@/components/SignupForm";
import { buildOpenGraph } from "@/lib/metadata";

const TITLE = "Criar conta";
const DESCRIPTION =
  "Crie sua conta gratuita para guardar roteiros de viagem e receber recomendações sob medida.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  robots: { index: false },
  alternates: { canonical: "/criar-conta" },
  openGraph: buildOpenGraph({ title: TITLE, description: DESCRIPTION }),
};

export default function CriarContaPage() {
  return (
    <AuthCard
      title="Criar conta"
      subtitle="Guarde seus roteiros e receba recomendações sob medida."
      footer={
        <>
          Já tem conta?{" "}
          <Link href="/entrar" className="text-terracota hover:underline">
            Entrar
          </Link>
        </>
      }
    >
      <SignupForm />
    </AuthCard>
  );
}

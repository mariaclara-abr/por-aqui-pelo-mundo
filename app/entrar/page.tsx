import type { Metadata } from "next";
import Link from "next/link";
import AuthCard from "@/components/AuthCard";
import LoginForm from "@/components/LoginForm";
import { buildOpenGraph } from "@/lib/metadata";

const TITLE = "Entrar";
const DESCRIPTION = "Acesse sua conta para montar e salvar seu roteiro de viagem.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  robots: { index: false },
  alternates: { canonical: "/entrar" },
  openGraph: buildOpenGraph({ title: TITLE, description: DESCRIPTION }),
};

export default function EntrarPage() {
  return (
    <AuthCard
      title="Entrar"
      subtitle="Acesse sua conta para montar seu roteiro."
      footer={
        <>
          Não tem conta?{" "}
          <Link
            href="/criar-conta"
            className="text-terracota hover:underline"
          >
            Criar conta
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthCard>
  );
}

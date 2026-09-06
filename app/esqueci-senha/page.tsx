import type { Metadata } from "next";
import Link from "next/link";
import AuthCard from "@/components/AuthCard";
import ForgotPasswordForm from "@/components/ForgotPasswordForm";
import { buildOpenGraph } from "@/lib/metadata";

const TITLE = "Esqueci minha senha";
const DESCRIPTION = "Receba um código de verificação por e-mail para redefinir sua senha.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  robots: { index: false },
  alternates: { canonical: "/esqueci-senha" },
  openGraph: buildOpenGraph({ title: TITLE, description: DESCRIPTION }),
};

export default function EsqueciSenhaPage() {
  return (
    <AuthCard
      title="Esqueci minha senha"
      subtitle="Informe seu e-mail para receber um código de verificação."
      footer={
        <>
          Lembrou a senha?{" "}
          <Link href="/entrar" className="text-terracota hover:underline">
            Entrar
          </Link>
        </>
      }
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
}

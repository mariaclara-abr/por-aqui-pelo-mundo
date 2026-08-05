import type { Metadata } from "next";
import Link from "next/link";
import AuthCard from "@/components/AuthCard";
import SignupForm from "@/components/SignupForm";

export const metadata: Metadata = {
  title: "Criar conta — Por Aqui Pelo Mundo",
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

import type { Metadata } from "next";
import Link from "next/link";
import AuthCard from "@/components/AuthCard";
import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Entrar — Por Aqui Pelo Mundo",
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

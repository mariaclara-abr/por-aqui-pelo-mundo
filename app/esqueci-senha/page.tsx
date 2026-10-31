import type { Metadata } from "next";
import Link from "next/link";
import PraiaAnimada from "@/components/PraiaAnimada";
import ForgotPasswordForm from "@/components/ForgotPasswordForm";
import { buildOpenGraph } from "@/lib/metadata";
import styles from "../entrar/entrar.module.css";

const TITLE = "Esqueci minha senha";
const DESCRIPTION = "Receba um link por e-mail para redefinir sua senha.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  robots: { index: false },
  alternates: { canonical: "/esqueci-senha" },
  openGraph: buildOpenGraph({ title: TITLE, description: DESCRIPTION }),
};

export default async function EsqueciSenhaPage({
  searchParams,
}: {
  searchParams: Promise<{ nova?: string; expirado?: string }>;
}) {
  const { nova, expirado } = await searchParams;
  return (
    <main className={styles.page}>
      <div className={styles.scene}>
        <PraiaAnimada />
      </div>

      <Link href="/" className={styles.back}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="m12 5-7 7 7 7M5 12h14" />
        </svg>
        Voltar a explorar
      </Link>

      <section className={styles.card} aria-labelledby="forgot-title">
        <h1 id="forgot-title" className={styles.title}>
          {nova ? (
            <>
              Nova <em>senha.</em>
            </>
          ) : (
            <>
              Esqueci minha <em>senha.</em>
            </>
          )}
        </h1>
        <p className={styles.intro}>
          {nova
            ? "Escolha a nova senha da sua conta."
            : "Informe seu e-mail para receber um link de redefinição."}
        </p>

        {expirado && (
          <p role="alert" className="mb-4 rounded-lg border border-terracota/30 bg-terracota/10 px-3 py-2 text-left text-sm text-tinta">
            Esse link expirou ou já foi usado. Peça um novo abaixo.
          </p>
        )}

        <ForgotPasswordForm newPassword={Boolean(nova)} />

        <p className={styles.signup}>
          Lembrou a senha? <Link href="/entrar">Entrar</Link>
        </p>
      </section>

      <p className={styles.note}>Por Aqui Pelo Mundo</p>
    </main>
  );
}

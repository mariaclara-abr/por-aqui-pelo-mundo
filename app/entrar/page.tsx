import type { Metadata } from "next";
import Link from "next/link";
import LoginForm from "@/components/LoginForm";
import PraiaAnimada from "@/components/PraiaAnimada";
import { buildOpenGraph } from "@/lib/metadata";
import styles from "./entrar.module.css";

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

      <section className={styles.card} aria-labelledby="login-title">
        <h1 id="login-title" className={styles.title}>
          Que bom ter<br />
          você <em>por aqui.</em>
        </h1>
        <p className={styles.intro}>
          Entre para continuar seus planos e guardar novas descobertas.
        </p>

        <LoginForm />

        <p className={styles.signup}>
          Ainda não tem uma conta?{" "}
          <Link href="/criar-conta">Comece por aqui</Link>
        </p>
      </section>

      <p className={styles.note}>Por Aqui Pelo Mundo</p>
    </main>
  );
}

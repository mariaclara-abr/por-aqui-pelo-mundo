import type { Metadata } from "next";
import Link from "next/link";
import PraiaAnimada from "@/components/PraiaAnimada";
import SignupForm from "@/components/SignupForm";
import { buildOpenGraph } from "@/lib/metadata";
import styles from "../entrar/entrar.module.css";

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

      <section className={styles.card} aria-labelledby="signup-title">
        <h1 id="signup-title" className={styles.title}>
          Criar <em>conta.</em>
        </h1>
        <p className={styles.intro}>
          Guarde seus roteiros e receba recomendações sob medida.
        </p>

        <SignupForm />

        <p className={styles.signup}>
          Já tem conta? <Link href="/entrar">Entrar</Link>
        </p>
      </section>

      <p className={styles.note}>Por Aqui Pelo Mundo</p>
    </main>
  );
}

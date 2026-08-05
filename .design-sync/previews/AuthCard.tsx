import AuthCard from "@/components/AuthCard";
import PasswordInput from "@/components/PasswordInput";

export function LoginForm() {
  return (
    <AuthCard
      title="Entrar"
      subtitle="Acesse sua conta para ver seu roteiro"
      footer={
        <>
          Não tem conta?{" "}
          <span className="text-terracota underline-offset-2 hover:underline">
            Criar conta
          </span>
        </>
      }
    >
      <div className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="E-mail"
          className="w-full rounded-lg border border-oliva/30 bg-branco px-3 py-2 text-sm text-tinta placeholder:text-oliva/50 focus:border-terracota focus:outline-none"
        />
        <PasswordInput placeholder="Senha" />
        <button
          type="button"
          className="mt-2 rounded-full bg-terracota px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-terracota/90"
        >
          Entrar
        </button>
      </div>
    </AuthCard>
  );
}

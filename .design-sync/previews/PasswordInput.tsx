import PasswordInput from "@/components/PasswordInput";

export function Default() {
  return (
    <div className="w-72 bg-branco p-6">
      <PasswordInput placeholder="Senha" defaultValue="minhasenha123" />
    </div>
  );
}

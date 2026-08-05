import ConfirmDialog from "@/components/ConfirmDialog";

export function Default() {
  return (
    <ConfirmDialog
      message="Tem certeza que quer sair da sua conta?"
      confirmLabel="Sim, sair"
      onConfirm={() => {}}
      onCancel={() => {}}
    />
  );
}

export function Pending() {
  return (
    <ConfirmDialog
      message="Tem certeza que quer sair da sua conta?"
      confirmLabel="Sim, sair"
      pendingLabel="Saindo..."
      pending
      onConfirm={() => {}}
      onCancel={() => {}}
    />
  );
}

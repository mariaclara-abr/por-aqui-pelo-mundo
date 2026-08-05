import type { ReactNode } from "react";

export const inputClass =
  "w-full rounded-lg border border-oliva/30 bg-branco px-3 py-2 text-sm text-tinta focus:border-terracota focus:outline-none";

export default function FormField({
  label,
  htmlFor,
  helpText,
  children,
}: {
  label: string;
  htmlFor: string;
  helpText?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="text-sm font-medium text-tinta">
        {label}
      </label>
      <div className="mt-1">{children}</div>
      {helpText && <p className="mt-1 text-xs text-oliva">{helpText}</p>}
    </div>
  );
}

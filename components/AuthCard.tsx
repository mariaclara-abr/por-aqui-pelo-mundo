import type { ReactNode } from "react";

export default function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm rounded-xl bg-branco p-8 shadow-sm">
        <h1 className="font-serif text-2xl text-tinta">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-oliva">{subtitle}</p>}
        <div className="mt-6">{children}</div>
        {footer && (
          <div className="mt-6 text-center text-sm text-oliva">{footer}</div>
        )}
      </div>
    </main>
  );
}

"use client";

import { useState, type InputHTMLAttributes } from "react";

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export default function PasswordInput({ className, ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <input
        {...props}
        type={showPassword ? "text" : "password"}
        className={
          className ??
          "w-full rounded-lg border border-oliva/30 bg-branco px-3 py-2 pr-10 text-sm text-tinta focus:border-terracota focus:outline-none"
        }
      />
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
        className="absolute inset-y-0 right-0 flex items-center px-3 text-oliva hover:text-terracota"
      >
        {showPassword ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <path d="M3 3l18 18" />
            <path d="M10.58 10.58a2 2 0 0 0 2.83 2.83" />
            <path d="M9.88 5.09A9.94 9.94 0 0 1 12 5c6.5 0 10 7 10 7a17.6 17.6 0 0 1-3.15 4.16M6.5 6.65A17.5 17.5 0 0 0 2 12s3.5 7 10 7a9.9 9.9 0 0 0 4.05-.86" />
          </svg>
        )}
      </button>
    </div>
  );
}

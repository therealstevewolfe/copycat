import React, { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

export type ButtonProps = {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  state?: "primary" | "secondary" | "dropdown" | "destructive";
  size?: "small" | "medium" | "large";
} & ButtonHTMLAttributes<HTMLButtonElement>;

const stateStyles: Record<
  NonNullable<ButtonProps["state"]> | "default",
  string
> = {
  primary:
    "border border-white/80 bg-white text-black shadow-[0_12px_32px_rgba(255,255,255,0.16)] hover:bg-white/95 hover:shadow-[0_10px_26px_rgba(255,255,255,0.22)] focus-visible:ring-white/80",
  secondary:
    "border border-white/25 bg-white/10 text-white hover:bg-white/20 focus-visible:ring-white/40",
  dropdown:
    "border border-white/15 bg-transparent text-white hover:bg-white/10 focus-visible:ring-white/30",
  destructive:
    "border border-red-500/60 bg-red-500/10 text-red-100 hover:bg-red-500/20 focus-visible:ring-red-200/80",
  default:
    "border border-white/20 bg-transparent text-white hover:bg-white/10 focus-visible:ring-white/40",
};

const sizeStyles: Record<NonNullable<ButtonProps["size"]>, string> = {
  small: "h-8 px-3 text-xs",
  medium: "h-10 px-4 text-sm",
  large: "h-12 px-5 text-base",
};

export function Button({
  children,
  className,
  disabled,
  state,
  size = "medium",
  ...allProps
}: ButtonProps) {
  const variantClass = stateStyles[state ?? "default"];
  const sizeClass = sizeStyles[size];

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all duration-200 ease-out active:translate-y-[1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-60",
        disabled && "pointer-events-none",
        variantClass,
        sizeClass,
        className,
      )}
      disabled={disabled}
      {...allProps}
    >
      {children}
    </button>
  );
}

export function LoadingSVG({
  diameter = 20,
  strokeWidth = 4,
}: {
  diameter?: number;
  strokeWidth?: number;
}) {
  return (
    <svg
      className="animate-spin"
      fill="none"
      viewBox="0 0 24 24"
      style={{
        width: `${diameter}px`,
        height: `${diameter}px`,
      }}
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth={strokeWidth}
      ></circle>
      <path
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
}

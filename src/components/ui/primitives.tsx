import type { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Icon, type IconName } from "@/components/icons";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2.5 font-semibold transition-all duration-180 select-none cursor-pointer disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "button primary",
        secondary: "button secondary",
        glass: "button glass-button",
        ghost:
          "min-h-[44px] px-4 py-2.5 rounded-[14px] text-[var(--text)] hover:text-[var(--gold-bright)] hover:bg-white/[0.04]",
        danger:
          "min-h-[44px] px-5 py-2.5 rounded-[14px] border border-[rgba(241,111,111,0.45)] bg-[rgba(241,111,111,0.12)] text-[#ffd6d6] hover:bg-[rgba(241,111,111,0.2)]",
      },
      size: {
        sm: "min-h-[38px] px-3.5 py-1.5 text-sm rounded-[12px]",
        md: "min-h-[46px] px-5 py-2.5 text-[15px]",
        lg: "min-h-[52px] px-6 py-3 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({
  className,
  variant,
  size,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: IconName;
  label: string;
  size?: number;
  active?: boolean;
};

export function IconButton({
  icon,
  label,
  size = 18,
  active = false,
  className,
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      aria-pressed={active ? true : undefined}
      className={cn(
        "inline-grid place-items-center w-11 h-11 rounded-full border transition-all duration-180 cursor-pointer",
        active
          ? "border-[var(--border-gold)] bg-[rgba(245,189,67,0.16)] text-[var(--gold-bright)] shadow-[var(--gold-glow)]"
          : "border-[var(--border)] bg-[rgba(8,13,18,0.72)] text-[var(--text)] hover:border-[var(--border-gold)] hover:text-[var(--gold-bright)]",
        className,
      )}
      {...props}
    >
      <Icon name={icon} size={size} />
    </button>
  );
}

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium tracking-wide border",
  {
    variants: {
      tone: {
        gold: "border-[rgba(245,189,67,0.45)] bg-[rgba(245,189,67,0.14)] text-[var(--gold-bright)]",
        neutral: "border-[var(--border)] bg-white/[0.04] text-[var(--text)]",
        success: "border-[rgba(72,199,142,0.45)] bg-[rgba(72,199,142,0.14)] text-[#9be7c4]",
        warning: "border-[rgba(232,180,94,0.45)] bg-[rgba(232,180,94,0.14)] text-[#f6d494]",
        info: "border-[rgba(110,168,254,0.45)] bg-[rgba(110,168,254,0.14)] text-[#b6d4fe]",
      },
    },
    defaultVariants: {
      tone: "neutral",
    },
  },
);

export type BadgeProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants>;

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}

export function Chip({
  active = false,
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-2 min-h-[36px] px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide border transition-all cursor-pointer",
        active
          ? "border-[var(--border-gold)] bg-[rgba(245,189,67,0.16)] text-[var(--gold-bright)] shadow-[var(--gold-glow)]"
          : "border-[var(--border)] bg-[rgba(12,19,25,0.78)] text-[var(--text)] hover:border-[var(--border-gold)] hover:text-[var(--text-strong)]",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function GlassPanel({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[20px] border border-[var(--border)] bg-[rgba(8,13,18,0.76)] backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.38)]",
        className,
      )}
      {...props}
    />
  );
}

export function Card({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[18px] border border-[var(--border)] bg-[var(--bg-2)] p-5",
        className,
      )}
      {...props}
    />
  );
}

export function Input({
  label,
  error,
  id,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
}) {
  return (
    <div className="field-group">
      {label ? <label htmlFor={id}>{label}</label> : null}
      <input id={id} className={className} {...props} />
      {error ? (
        <p className="text-xs text-[var(--danger)] mt-1" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function Textarea({
  label,
  error,
  id,
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
}) {
  return (
    <div className="field-group">
      {label ? <label htmlFor={id}>{label}</label> : null}
      <textarea id={id} className={className} {...props} />
      {error ? (
        <p className="text-xs text-[var(--danger)] mt-1" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function Select({
  label,
  id,
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { label?: string }) {
  return (
    <div className="field-group">
      {label ? <label htmlFor={id}>{label}</label> : null}
      <select id={id} className={className} {...props}>
        {children}
      </select>
    </div>
  );
}

export function EmptyState({
  icon = "compass",
  title,
  description,
  action,
}: {
  icon?: IconName;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <Icon name={icon} size={32} />
      <h2>{title}</h2>
      <p>{description}</p>
      {action}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-pulse rounded-[14px] bg-white/[0.06] border border-white/[0.05]",
        className,
      )}
    />
  );
}

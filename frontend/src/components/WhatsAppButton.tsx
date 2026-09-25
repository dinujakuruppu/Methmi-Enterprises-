"use client";

import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/cn";
import { trackEvent } from "@/lib/analytics";

interface WhatsAppButtonProps {
  href: string;
  label?: string;
  variant?: "solid" | "outline" | "icon";
  size?: "sm" | "md" | "lg";
  className?: string;
  analyticsContext?: string;
}

export default function WhatsAppButton({
  href,
  label = "Book on WhatsApp",
  variant = "solid",
  size = "md",
  className,
  analyticsContext,
}: WhatsAppButtonProps) {
  const handleClick = () => {
    trackEvent("whatsapp_click", { context: analyticsContext || "unknown" });
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-sm gap-1.5",
    md: "px-5 py-3 text-base gap-2",
    lg: "px-7 py-4 text-lg gap-2.5",
  }[size];

  if (variant === "icon") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        aria-label={label}
        className={cn(
          "inline-flex items-center justify-center rounded-full bg-palm-500 text-white shadow-card transition-transform hover:scale-105 active:scale-95",
          "h-14 w-14",
          className
        )}
      >
        <MessageCircle className="h-6 w-6" aria-hidden="true" />
      </a>
    );
  }

  const variantClasses =
    variant === "solid"
      ? "bg-palm-500 text-white hover:bg-palm-600 shadow-card"
      : "border-2 border-palm-500 text-palm-600 hover:bg-palm-50";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold transition-all hover:-translate-y-0.5 active:translate-y-0",
        sizeClasses,
        variantClasses,
        className
      )}
    >
      <MessageCircle className="h-5 w-5" aria-hidden="true" />
      {label}
    </a>
  );
}

import { LucideIcon } from "lucide-react";

interface TrustBadgeProps {
  icon: LucideIcon;
  label: string;
  sublabel?: string;
}

export default function TrustBadge({ icon: Icon, label, sublabel }: TrustBadgeProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl2 bg-white/90 px-4 py-3 shadow-soft backdrop-blur">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ocean-50 text-ocean-600">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <div>
        <p className="text-sm font-bold text-ink-900 sm:text-base">{label}</p>
        {sublabel && <p className="text-xs text-ink-700">{sublabel}</p>}
      </div>
    </div>
  );
}

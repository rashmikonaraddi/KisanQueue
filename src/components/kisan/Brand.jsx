import { Link } from "@tanstack/react-router";
import { Wheat } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/kisan/i18n";
function Brand({ className, subtitle = true }) {
  const { t } = useI18n();
  return <Link to="/" className={cn("flex items-center gap-2.5", className)}>
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
        <Wheat className="size-5" />
      </span>
      <span className="leading-tight">
        <span className="block font-display text-base font-bold tracking-tight">{t("app.name")}</span>
        {subtitle && <span className="block text-[11px] text-muted-foreground">{t("app.subtitle") || "Smart Procurement Queue"}</span>}
      </span>
    </Link>;
}
export {
  Brand
};

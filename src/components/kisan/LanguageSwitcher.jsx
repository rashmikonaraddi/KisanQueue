import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { LANGUAGES, useI18n } from "@/lib/kisan/i18n";
function LanguageSwitcher() {
  const { lang, setLang } = useI18n();
  const active = LANGUAGES.find((l) => l.code === lang);
  return <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Languages className="size-4" />
          <span className="hidden sm:inline">{active?.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LANGUAGES.map((l) => <DropdownMenuItem
    key={l.code}
    onClick={() => setLang(l.code)}
    className={l.code === lang ? "font-semibold text-primary" : ""}
  >
            {l.label}
          </DropdownMenuItem>)}
      </DropdownMenuContent>
    </DropdownMenu>;
}
export {
  LanguageSwitcher
};

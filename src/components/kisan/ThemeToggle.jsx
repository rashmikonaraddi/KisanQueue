import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);
  return <Button
    variant="outline"
    size="icon"
    aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
    onClick={() => setDark((d) => !d)}
  >
      {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>;
}
export {
  ThemeToggle
};

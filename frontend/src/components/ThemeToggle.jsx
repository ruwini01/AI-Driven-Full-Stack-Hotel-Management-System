import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export const ThemeToggle = () => {
const [theme, setTheme] = useState("light");
const [mounted, setMounted] = useState(false);

useEffect(() => {
const savedTheme = localStorage.getItem("theme") || "light";
setTheme(savedTheme);
document.documentElement.classList.toggle("dark", savedTheme === "dark");
setMounted(true);
}, []);

const toggleTheme = () => {
const newTheme = theme === "light" ? "dark" : "light";
setTheme(newTheme);
document.documentElement.classList.toggle("dark", newTheme === "dark");
localStorage.setItem("theme", newTheme);
};

if (!mounted) return null;

return ( <Button
   onClick={toggleTheme}
   variant="ghost"
   size="icon"
   className="hover:bg-accent/20 transition-colors"
   aria-label="Toggle theme"
 >
{theme === "light" ? ( <Moon className="h-5 w-5 text-primary" />
) : ( <Sun className="h-5 w-5 text-accent" />
)} </Button>
);
};

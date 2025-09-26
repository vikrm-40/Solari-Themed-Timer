import * as React from "react";
import { cn } from "@/lib/utils";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({
  isDark,
  onToggle,
  className
}) => {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "theme-toggle group relative",
        "hover:scale-105 active:scale-95",
        className
      )}
      aria-label="Toggle theme"
    >
      <div className="relative w-6 h-6">
        <Sun 
          className={cn(
            "absolute inset-0 h-6 w-6 transition-all duration-300",
            "text-yellow-500 group-hover:text-yellow-400",
            isDark ? "opacity-0 rotate-90 scale-0" : "opacity-100 rotate-0 scale-100"
          )} 
        />
        <Moon 
          className={cn(
            "absolute inset-0 h-6 w-6 transition-all duration-300",
            "text-blue-400 group-hover:text-blue-300",
            isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-0"
          )} 
        />
      </div>
      
      {/* Glow effect */}
      <div className={cn(
        "absolute inset-0 rounded-full opacity-0 group-hover:opacity-100",
        "bg-gradient-to-r transition-opacity duration-300",
        isDark 
          ? "from-blue-400/20 to-purple-400/20" 
          : "from-yellow-400/20 to-orange-400/20"
      )} />
    </button>
  );
};

export { ThemeToggle };
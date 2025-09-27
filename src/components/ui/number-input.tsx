import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { ChevronUp, ChevronDown } from "lucide-react";

interface NumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
}

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ className, value, onChange, min = 0, max = 99, step = 1, label, ...props }, ref) => {
    const increment = () => {
      const newValue = Math.min(value + step, max);
      onChange(newValue);
    };

    const decrement = () => {
      const newValue = Math.max(value - step, min);
      onChange(newValue);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseInt(e.target.value) || 0;
      if (newValue >= min && newValue <= max) {
        onChange(newValue);
      }
    };

    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-muted-foreground block text-center">
            {label}
          </label>
        )}
        <div className="flex flex-col items-center space-y-1">
          {/* Increment Button */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={increment}
            className="w-16 h-8 rounded-md hover:bg-primary/20 border border-border/50"
            disabled={value >= max}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          
          {/* Number Display */}
          <div className="relative">
            <input
              ref={ref}
              type="number"
              value={value.toString().padStart(2, '0')}
              onChange={handleInputChange}
              min={min}
              max={max}
              step={step}
              className={cn(
                "w-16 h-12 text-center text-lg font-bold rounded-md border border-border bg-background",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                "appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                className
              )}
              {...props}
            />
          </div>
          
          {/* Decrement Button */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={decrement}
            className="w-16 h-8 rounded-md hover:bg-primary/20 border border-border/50"
            disabled={value <= min}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }
);
NumberInput.displayName = "NumberInput";

export { NumberInput };
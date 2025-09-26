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
        <div className={cn("number-input-container relative w-20 h-12", className)}>
          <input
            ref={ref}
            type="number"
            value={value.toString().padStart(2, '0')}
            onChange={handleInputChange}
            min={min}
            max={max}
            step={step}
            className="number-input py-3 px-2"
            {...props}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={increment}
            className="number-button right-0 hover:bg-primary/20"
            disabled={value >= max}
          >
            <ChevronUp className="h-3 w-3" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={decrement}
            className="number-button left-0 hover:bg-primary/20"
            disabled={value <= min}
          >
            <ChevronDown className="h-3 w-3" />
          </Button>
        </div>
      </div>
    );
  }
);
NumberInput.displayName = "NumberInput";

export { NumberInput };
import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "./card";

interface EnhancedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'glass' | 'solid' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
}

const EnhancedCard = React.forwardRef<HTMLDivElement, EnhancedCardProps>(
  ({ className, variant = 'glass', size = 'md', glow = false, children, ...props }, ref) => {
    const variants = {
      glass: 'glass-card',
      solid: 'bg-card border border-border shadow-lg',
      gradient: 'gradient-primary text-primary-foreground border-0'
    };

    const sizes = {
      sm: 'p-4',
      md: 'p-6', 
      lg: 'p-8'
    };

    return (
      <Card
        ref={ref}
        className={cn(
          variants[variant],
          sizes[size],
          glow && 'glow-effect',
          'transition-all duration-300 hover:scale-[1.02]',
          className
        )}
        {...props}
      >
        {children}
      </Card>
    );
  }
);
EnhancedCard.displayName = "EnhancedCard";

const EnhancedCardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <CardHeader 
      ref={ref} 
      className={cn("text-center pb-4", className)} 
      {...props} 
    />
  )
);
EnhancedCardHeader.displayName = "EnhancedCardHeader";

const EnhancedCardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <CardContent 
      ref={ref} 
      className={cn("space-y-6", className)} 
      {...props} 
    />
  )
);
EnhancedCardContent.displayName = "EnhancedCardContent";

export { EnhancedCard, EnhancedCardHeader, EnhancedCardContent };
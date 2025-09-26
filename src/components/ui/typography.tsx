import * as React from "react";
import { cn } from "@/lib/utils";

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'display' | 'title' | 'heading' | 'body' | 'caption';
  gradient?: boolean;
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'black';
  font?: 'inter' | 'display' | 'mono';
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ className, variant = 'body', gradient = false, weight = 'normal', font = 'inter', children, ...props }, ref) => {
    const variants = {
      display: 'text-6xl md:text-8xl leading-tight tracking-tight',
      title: 'text-4xl md:text-6xl leading-tight tracking-tight',
      heading: 'text-2xl md:text-3xl leading-tight',
      body: 'text-base leading-relaxed',
      caption: 'text-sm leading-normal'
    };

    const weights = {
      light: 'font-light',
      normal: 'font-normal', 
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
      black: 'font-black'
    };

    const fonts = {
      inter: '',
      display: 'font-display',
      mono: 'font-mono'
    };

    const Component = variant === 'display' || variant === 'title' ? 'h1' : 
                     variant === 'heading' ? 'h2' : 'p';

    const gradientClass = gradient ? 'gradient-primary bg-clip-text text-transparent' : '';

    return React.createElement(
      Component,
      {
        ref,
        className: cn(
          variants[variant],
          weights[weight],
          fonts[font],
          gradientClass,
          className
        ),
        ...props
      },
      children
    );
  }
);
Typography.displayName = "Typography";

export { Typography };
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 disabled:pointer-events-none disabled:opacity-40 cursor-pointer select-none active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-sky-500 text-slate-950 shadow-md hover:bg-sky-400 hover:shadow-sky-500/20",
        destructive:
          "bg-rose-500/15 text-rose-400 border border-rose-500/30 hover:bg-rose-500/25",
        outline:
          "border border-slate-800 bg-slate-900 text-slate-200 hover:bg-slate-800 hover:text-slate-100",
        secondary:
          "bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-slate-100 border border-slate-700",
        ghost:
          "hover:bg-slate-800 text-slate-400 hover:text-slate-100",
        link:
          "text-sky-400 underline-offset-4 hover:underline",
        learned:
          "bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 shadow-lg shadow-emerald-500/20",
        learnedOutline:
          "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20",
        inProgress:
          "bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 shadow-lg shadow-amber-500/20",
        inProgressOutline:
          "bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-2xl px-6 text-base",
        icon: "h-9 w-9 rounded-xl",
        iconSm: "h-7 w-7 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

// eslint-disable-next-line react-refresh/only-export-components
export { Button, buttonVariants };

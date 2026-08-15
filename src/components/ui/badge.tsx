import * as React from "react";
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-sky-500 text-slate-950 shadow hover:bg-sky-400",
        secondary:
          "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700",
        destructive:
          "border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20",
        outline:
          "border-slate-800 text-slate-300",
        learned:
          "border-emerald-500/30 bg-emerald-500/15 text-emerald-400",
        inProgress:
          "border-amber-500/30 bg-amber-500/15 text-amber-400",
        hsk:
          "border-sky-500/30 bg-sky-500/10 text-sky-400 font-mono",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export { Badge, badgeVariants };

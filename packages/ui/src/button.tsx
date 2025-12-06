import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { Slot as SlotPrimitive } from "radix-ui";

import { cn } from "@acme/ui";

export const buttonVariants = cva(
  "focus-visible:ring-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-invalid:border-destructive inline-flex shrink-0 items-center justify-center gap-2 border-2 text-sm font-medium whitespace-nowrap transition-all outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground border-primary hover:bg-transparent hover:text-primary",
        destructive:
          "bg-destructive text-destructive-foreground border-destructive hover:bg-transparent hover:text-destructive",
        outline:
          "bg-transparent border-foreground text-foreground hover:bg-foreground hover:text-background",
        secondary:
          "bg-secondary text-secondary-foreground border-secondary hover:bg-transparent hover:border-foreground",
        ghost:
          "border-transparent hover:bg-muted hover:border-muted",
        link: "border-transparent text-foreground underline-offset-4 hover:underline",
        accent:
          "bg-accent text-accent-foreground border-accent hover:bg-transparent hover:text-accent",
      },
      size: {
        default: "h-10 px-6 py-2 has-[>svg]:px-4",
        sm: "h-8 gap-1.5 px-4 has-[>svg]:px-3",
        lg: "h-12 px-8 has-[>svg]:px-6",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? SlotPrimitive.Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

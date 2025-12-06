import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@acme/ui"

const badgeVariants = cva(
  "inline-flex items-center justify-center border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:ring-accent focus-visible:ring-2 aria-invalid:border-destructive transition-colors overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-primary bg-primary text-primary-foreground [a&]:hover:bg-transparent [a&]:hover:text-primary",
        secondary:
          "border-foreground bg-transparent text-foreground [a&]:hover:bg-foreground [a&]:hover:text-background",
        destructive:
          "border-destructive bg-destructive text-destructive-foreground [a&]:hover:bg-transparent [a&]:hover:text-destructive",
        outline:
          "border-foreground text-foreground [a&]:hover:bg-foreground [a&]:hover:text-background",
        accent:
          "border-accent bg-accent text-accent-foreground [a&]:hover:bg-transparent [a&]:hover:text-accent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }

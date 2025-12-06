import * as React from "react"

import { cn } from "@acme/ui"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-foreground placeholder:text-muted-foreground focus-visible:border-accent focus-visible:bg-accent/5 aria-invalid:border-destructive flex field-sizing-content min-h-24 w-full border-2 bg-transparent px-3 py-2 text-sm transition-colors outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }

import { cn } from "@acme/ui";

export function Input({
  className,
  type,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-accent selection:text-accent-foreground border-foreground h-10 w-full min-w-0 border-2 bg-transparent px-3 py-2 text-sm transition-colors outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-accent focus-visible:bg-accent/5",
        "aria-invalid:border-destructive",
        className,
      )}
      {...props}
    />
  );
}

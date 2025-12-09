import * as React from "react"

import { cn } from "@acme/ui"

/**
 * Renders a styled card container element.
 *
 * The element uses predefined layout and visual styles, merges any provided `className` with those styles,
 * and spreads remaining props onto the root `div`. The root element includes `data-slot="card"`.
 *
 * @param className - Additional CSS class names to merge with the component's default classes
 * @param props - Other props passed through to the underlying `div` element
 * @returns A `div` element configured as a card container with merged classes and forwarded props
 */
function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 border-2 border-foreground p-6",
        className
      )}
      {...props}
    />
  )
}

/**
 * Renders the Card header container with the header-specific grid layout and slot attribute.
 *
 * @param className - Additional CSS classes to merge with the component's default header classes
 * @returns A div element with `data-slot="card-header"` and the header layout and spacing classes applied
 */
function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

/**
 * Renders the card title element with small uppercase, tracked title styling.
 *
 * @param className - Additional CSS classes merged with the component's default title styles.
 * @param props - Other `div` attributes and event handlers forwarded to the rendered element.
 * @returns The `div` element with `data-slot="card-title"` and the component's title typography classes.
 */
function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("text-sm font-medium uppercase tracking-wider", className)}
      {...props}
    />
  )
}

/**
 * Renders the card's description element.
 *
 * @returns A `div` element with `data-slot="card-description"` styled with muted foreground color and extra-small (`text-xs`) text; additional props and `className` are forwarded to the element.
 */
function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-xs", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

/**
 * Renders the card's content container.
 *
 * Merges a default text size with any additional CSS classes and forwards all other div props.
 *
 * @param className - Additional CSS classes to merge with the component's default classes
 * @param props - Remaining div element props are spread onto the root element
 * @returns The rendered content div with `data-slot="card-content"`
 */
function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("text-sm", className)}
      {...props}
    />
  )
}

/**
 * Renders the card footer section with a prominent top border and spacing to separate it from the card content.
 *
 * @param className - Additional CSS classes to merge with the footer's default styles
 * @returns The footer `div` element with `data-slot="card-footer"`, a top border, and layout spacing
 */
function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center border-t-2 border-foreground pt-4 -mx-6 px-6 -mb-6 pb-6", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
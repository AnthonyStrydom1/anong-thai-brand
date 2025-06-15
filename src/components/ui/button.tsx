
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anong-gold focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow-sm hover:shadow-md",
  {
    variants: {
      variant: {
        default: "anong-btn-secondary",
        destructive:
          "bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg",
        outline:
          "border border-anong-gold/30 bg-transparent hover:bg-anong-gold/10 hover:border-anong-gold text-anong-deep-green",
        secondary:
          "bg-anong-cream text-anong-deep-green hover:bg-anong-ivory border border-anong-gold/20 shadow-md hover:shadow-lg",
        ghost: "bg-transparent hover:bg-anong-gold/10 hover:text-anong-deep-green transition-colors",
        link: "text-anong-gold underline-offset-4 hover:underline hover:text-anong-warm-yellow",
        gold: "anong-btn-primary",
        subtle: "bg-anong-ivory text-anong-deep-green hover:bg-anong-cream shadow-sm hover:shadow-md border border-anong-gold/10",
        premium: "bg-gradient-to-r from-anong-deep-green to-anong-black text-anong-ivory hover:shadow-xl hover:shadow-anong-gold/20 border border-anong-gold/20",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 text-lg rounded-xl px-10",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

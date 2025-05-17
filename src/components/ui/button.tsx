
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-thai-purple text-white hover:bg-thai-purple-dark shadow-md hover:shadow-lg hover:shadow-purple-500/20",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-md hover:shadow-lg",
        ghost: "bg-transparent hover:bg-white hover:bg-opacity-20 transition-colors",
        link: "text-primary underline-offset-4 hover:underline",
        gold: "bg-gradient-to-r from-thai-gold to-thai-gold/85 text-[#3b0b5a] hover:from-thai-gold/95 hover:to-thai-gold/80 shadow-md hover:shadow-lg hover:shadow-amber-500/20",
        subtle: "bg-[#f8f4ff] text-thai-purple hover:bg-[#f0e8ff] shadow-sm hover:shadow-md",
        premium: "bg-gradient-to-r from-[#3b0b5a] to-[#6a1f97] text-white hover:shadow-xl hover:shadow-purple-500/30 border border-white/10",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 rounded-md px-4",
        lg: "h-11 rounded-md px-8",
        xl: "h-12 text-base rounded-md px-10",
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

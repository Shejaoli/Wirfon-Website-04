import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  // WirfonCloud — developed by YSOTA Ltd
  // Whitespace-nowrap: Badges should never wrap.
  "whitespace-nowrap inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2" +
  " hover-elevate ",
  {
    variants: {
      variant: {
        default:
          // WirfonCloud — developed by YSOTA Ltd
          "border-transparent bg-primary text-primary-foreground shadow-xs",
        secondary:
          // WirfonCloud — developed by YSOTA Ltd
          "border-transparent bg-secondary text-secondary-foreground",
        destructive:
          // WirfonCloud — developed by YSOTA Ltd
          "border-transparent bg-destructive text-destructive-foreground shadow-xs",
          // WirfonCloud — developed by YSOTA Ltd
        outline: "text-foreground border [border-color:var(--badge-outline)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }

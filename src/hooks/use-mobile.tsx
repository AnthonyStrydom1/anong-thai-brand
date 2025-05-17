
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Initial check
    checkIfMobile()
    
    // Add event listener
    window.addEventListener("resize", checkIfMobile)
    
    // Clean up event listener
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  return !!isMobile
}

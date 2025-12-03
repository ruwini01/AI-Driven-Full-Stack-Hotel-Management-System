import { useState, useEffect } from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Create a media query list
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    // Handler to update state
    const onChange = (e) => {
      setIsMobile(e.matches);
    };

    // Add listener
    mql.addEventListener("change", onChange);

    // Set initial value
    setIsMobile(mql.matches);

    // Cleanup
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isMobile;
}

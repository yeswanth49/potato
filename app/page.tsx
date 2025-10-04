import { LandingShell } from "@/components/landing-shell"
import { PortfolioContent } from "@/components/portfolio-content"

export default function Home() {
  // Set to false to skip the keyboard landing screen and go directly to portfolio
  const showKeyboardLanding = true // Change to false to disable keyboard animation

  return (
    <LandingShell
      mainBackgroundMode="dark"
      showLandingOnLoad={showKeyboardLanding}
    >
      <PortfolioContent />
    </LandingShell>
  )
}

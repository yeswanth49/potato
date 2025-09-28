import { LandingShell } from "@/components/landing-shell"
import { PortfolioContent } from "@/components/portfolio-content"

export default function Home() {
  return (
    <LandingShell mainBackgroundMode="dark">
      <PortfolioContent />
    </LandingShell>
  )
}

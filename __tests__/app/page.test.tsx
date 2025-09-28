import React from "react"
import { render, screen, within } from "@testing-library/react"
import "@testing-library/jest-dom"

import Home from "@/app/page"

jest.mock("@/components/landing-shell", () => ({
  LandingShell: ({ children, mainBackgroundMode }: any) => (
    <section data-testid="landing-shell" data-main-background-mode={mainBackgroundMode}>
      {children}
    </section>
  ),
}))

jest.mock("@/components/portfolio-content", () => ({
  PortfolioContent: () => <article data-testid="portfolio-content">portfolio-content</article>,
}))

describe("Home page", () => {
  it("renders LandingShell and PortfolioContent", () => {
    render(<Home />)

    expect(screen.getByTestId("landing-shell")).toBeInTheDocument()
    expect(screen.getByTestId("portfolio-content")).toBeInTheDocument()
  })

  it('passes mainBackgroundMode="dark" to LandingShell', () => {
    render(<Home />)

    expect(screen.getByTestId("landing-shell")).toHaveAttribute("data-main-background-mode", "dark")
  })

  it("nests PortfolioContent within LandingShell", () => {
    render(<Home />)

    const landingShell = screen.getByTestId("landing-shell")
    expect(within(landingShell).getByTestId("portfolio-content")).toBeInTheDocument()
  })

  it("returns a React element with expected props", () => {
    const element = Home() as React.ReactElement
    expect(element).toBeTruthy()
    expect(element.props.mainBackgroundMode).toBe("dark")

    const child = element.props.children as React.ReactElement
    expect(child).toBeTruthy()
    expect(child.type).toBeDefined()
    expect(child.props).toMatchObject({})
  })

  it("renders without crashing inside React.StrictMode", () => {
    const strictTree = (
      <React.StrictMode>
        <Home />
      </React.StrictMode>
    )

    expect(() => render(strictTree)).not.toThrow()
    expect(screen.getByTestId("landing-shell")).toBeInTheDocument()
    expect(screen.getByTestId("portfolio-content")).toBeInTheDocument()
  })
})
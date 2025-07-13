import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Home } from "../home";

describe("Home", () => {
  it("should render the home page with heading", () => {
    render(<Home />);

    // Check for main heading
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("should render admin button when MSAL is disabled", () => {
    render(<Home />);

    // Check for admin button
    const adminButton = screen.getByRole("button", { name: /go to admin/i });
    expect(adminButton).toBeInTheDocument();
  });

  it("should render with proper container structure", () => {
    const { container } = render(<Home />);

    // Check for container elements
    const containerElement = container.querySelector(".MuiContainer-root");
    expect(containerElement).toBeInTheDocument();
  });
});

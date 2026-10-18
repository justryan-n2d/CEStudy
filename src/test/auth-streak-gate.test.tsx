import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { LearningStreakBadge } from "../components/LearningStreakBadge";

describe("authenticated learning streak", () => {
  it("does not reveal the streak count to a signed-out visitor", () => {
    render(<MemoryRouter><LearningStreakBadge /></MemoryRouter>);

    expect(screen.getByText(/sign in with google to track your learning streak/i)).toBeInTheDocument();
    expect(screen.queryByText(/\d+ day(?:s)? streak/i)).not.toBeInTheDocument();
  });

  it("provides a link to Google sign-in", () => {
    render(<MemoryRouter><LearningStreakBadge /></MemoryRouter>);

    expect(screen.getByRole("link", { name: /sign in with google/i })).toHaveAttribute("href", "/login");
  });
});

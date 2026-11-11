import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import ReadingForm from "../components/ReadingForm";

describe("ReadingForm", () => {
  it("shows a clear validation error when value is empty", () => {
    render(<ReadingForm onSubmit={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /save reading/i }));
    expect(screen.getByRole("alert")).toHaveTextContent("Please enter a glucose value.");
  });

  it("rejects values outside the allowed range", () => {
    render(<ReadingForm onSubmit={vi.fn()} />);
    fireEvent.change(screen.getByPlaceholderText("e.g. 110"), { target: { value: "39" } });
    fireEvent.click(screen.getByRole("button", { name: /save reading/i }));
    expect(screen.getByRole("alert")).toHaveTextContent("Value must be between 40 and 600 mg/dl.");
  });
});

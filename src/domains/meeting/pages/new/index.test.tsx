import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter, Route, Routes } from "react-router";
import { describe, expect, it } from "vitest";
import { NewMeetingPage } from "@/domains/meeting/pages/new";

describe("NewMeetingPage", () => {
  it("starts with no count selected and the submit button disabled", () => {
    const markup = renderToStaticMarkup(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={["/new/schedule"]}>
          <Routes>
            <Route path="/new/:flow" element={<NewMeetingPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );
    expect(markup).not.toContain('aria-pressed="true"');
    expect(markup).toMatch(/<button[^>]*disabled=""[^>]*>.*모임 생성하기/);
  });
});

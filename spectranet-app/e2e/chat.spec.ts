import { test, expect } from "@playwright/test";

test("primary flow: empty state, send a message, see a response", async ({
  page,
}) => {
  // Mock the AI route so this test never calls the real API — fast,
  // free, and reliable in CI regardless of API keys or quota.
  await page.route("**/api/chat", async (route) => {
    const body = [
      `data: {"type":"start"}`,
      `data: {"type":"text-start","id":"msg1"}`,
      `data: {"type":"text-delta","id":"msg1","delta":"This is a test response."}`,
      `data: {"type":"text-end","id":"msg1"}`,
      `data: {"type":"finish"}`,
      `data: [DONE]`,
      ``,
    ].join("\n\n");

    await route.fulfill({
      status: 200,
      contentType: "text/event-stream",
      body,
    });
  });

  await page.goto("/playground-chat");

  // Empty state should be visible first
  await expect(
    page.getByText("Ask me about your connection, data plan, or account.")
  ).toBeVisible();

  // Click an example prompt — this is the primary flow's entry point
  await page
    .getByRole("button", { name: "My internet keeps disconnecting" })
    .click();

  // The user's own message should appear immediately
  await expect(
    page.getByText("My internet keeps disconnecting")
  ).toBeVisible();

  // The mocked assistant response should eventually appear
  await expect(page.getByText("This is a test response.")).toBeVisible({
    timeout: 5000,
  });
});
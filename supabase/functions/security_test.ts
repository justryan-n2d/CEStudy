import {
  handleRequest as contentReviewHandler,
  isAllowedOrigin as isContentReviewOriginAllowed,
} from "./content-review-admin/index.ts";
import {
  handleRequest as feedbackInboxHandler,
  isAllowedOrigin as isFeedbackInboxOriginAllowed,
} from "./feedback-inbox-admin/index.ts";
import {
  handleRequest as publicMessageHandler,
  isAllowedOrigin as isPublicMessageOriginAllowed,
} from "./submit-public-message/index.ts";

function assertEquals<T>(actual: T, expected: T, message = "") {
  if (actual !== expected) {
    throw new Error(message + " expected " + JSON.stringify(expected) + ", got " + JSON.stringify(actual));
  }
}

async function withSecrets(run: () => Promise<void>) {
  const names = ["FEEDBACK_INBOX_ACCESS_KEY", "SUPABASE_SERVICE_ROLE_KEY", "SUPABASE_URL"];
  const previous = new Map(names.map((name) => [name, Deno.env.get(name)]));
  Deno.env.set("FEEDBACK_INBOX_ACCESS_KEY", "x".repeat(40));
  Deno.env.set("SUPABASE_SERVICE_ROLE_KEY", "test-only-server-key");
  Deno.env.set("SUPABASE_URL", "https://unit-test.supabase.co");
  try {
    await run();
  } finally {
    for (const name of names) {
      const value = previous.get(name);
      if (value === undefined) Deno.env.delete(name);
      else Deno.env.set(name, value);
    }
  }
}

Deno.test("content review only accepts trusted origins and eight-hex Pages previews", () => {
  assertEquals(isContentReviewOriginAllowed("https://cestudy.pages.dev"), true);
  assertEquals(isContentReviewOriginAllowed("https://design-white-blue-responsive.cestudy.pages.dev"), true);
  assertEquals(isContentReviewOriginAllowed("https://deadbeef.cestudy.pages.dev"), true);
  assertEquals(isContentReviewOriginAllowed("https://review-feature.cestudy.pages.dev"), false);
  assertEquals(isContentReviewOriginAllowed("https://deadbeef.cestudy.pages.dev:444"), false);
  assertEquals(isContentReviewOriginAllowed("https://deadbeef.cestudy.pages.dev.attacker.example"), false);
  assertEquals(isContentReviewOriginAllowed("http://deadbeef.cestudy.pages.dev"), false);
  assertEquals(isContentReviewOriginAllowed(null), false);
});

Deno.test("content review rejects requests from broad or lookalike preview hosts", async () => {
  const response = await contentReviewHandler(new Request("https://unit-test.supabase.co/functions/v1/content-review-admin", {
    method: "POST",
    headers: { origin: "https://review-feature.cestudy.pages.dev", "content-type": "application/json" },
    body: JSON.stringify({ action: "list" }),
  }));
  assertEquals(response.status, 403);
});

Deno.test("content review rejects unauthenticated requests before database access", async () => {
  await withSecrets(async () => {
    const response = await contentReviewHandler(new Request("https://unit-test.supabase.co/functions/v1/content-review-admin", {
      method: "POST",
      headers: { origin: "https://cestudy.pages.dev", "content-type": "application/json", "x-cestudy-content-token": "not-a-valid-token" },
      body: JSON.stringify({ action: "list" }),
    }));
    assertEquals(response.status, 401);
  });
});

Deno.test("feedback inbox rejects non-trusted preview origins", () => {
  assertEquals(isFeedbackInboxOriginAllowed("https://deadbeef.cestudy.pages.dev"), true);
  assertEquals(isFeedbackInboxOriginAllowed("https://review-feature.cestudy.pages.dev"), false);
  assertEquals(isFeedbackInboxOriginAllowed("https://deadbeef.cestudy.pages.dev:444"), false);
  assertEquals(isFeedbackInboxOriginAllowed("https://deadbeef.cestudy.pages.dev.attacker.example"), false);
  assertEquals(isFeedbackInboxOriginAllowed("http://deadbeef.cestudy.pages.dev"), false);
});

Deno.test("feedback inbox validates the owner token before private operations", async () => {
  await withSecrets(async () => {
    const response = await feedbackInboxHandler(new Request("https://unit-test.supabase.co/functions/v1/feedback-inbox-admin", {
      method: "POST",
      headers: { origin: "https://cestudy.pages.dev", "content-type": "application/json", "x-feedback-inbox-token": "invalid" },
      body: JSON.stringify({ action: "list" }),
    }));
    assertEquals(response.status, 401);
  });
});

Deno.test("public message form rejects arbitrary preview origins and accepts approved previews", async () => {
  assertEquals(isPublicMessageOriginAllowed("https://deadbeef.cestudy.pages.dev"), true);
  assertEquals(isPublicMessageOriginAllowed("https://review-feature.cestudy.pages.dev"), false);
  assertEquals(isPublicMessageOriginAllowed("https://deadbeef.cestudy.pages.dev:444"), false);
  assertEquals(isPublicMessageOriginAllowed("https://deadbeef.cestudy.pages.dev.attacker.example"), false);

  const rejected = await publicMessageHandler(new Request("https://unit-test.supabase.co/functions/v1/submit-public-message", {
    method: "POST",
    headers: { origin: "https://review-feature.cestudy.pages.dev", "content-type": "application/json" },
    body: JSON.stringify({ action: "feedback" }),
  }));
  assertEquals(rejected.status, 403);

  const preflight = await publicMessageHandler(new Request("https://unit-test.supabase.co/functions/v1/submit-public-message", {
    method: "OPTIONS",
    headers: { origin: "https://deadbeef.cestudy.pages.dev" },
  }));
  assertEquals(preflight.status, 200);
  assertEquals(preflight.headers.get("access-control-allow-origin"), "https://deadbeef.cestudy.pages.dev");
});

/**
 * Sendbox mock auth — bypasses Telegram HMAC verification and injects
 * test users by role. Enabled only when SENDBOX_MOCK_AUTH=1.
 */

export type SendboxRole =
  | "admin"
  | "readonly"
  | "seller"
  | "salon_manager"
  | "company_admin"
  | "super_admin";

export interface SendboxTestUser {
  role: SendboxRole;
  telegramId: string;
  name: string;
}

export const SENDBOX_TEST_USERS: SendboxTestUser[] = [
  { role: "admin", telegramId: "900000001", name: "Sendbox Admin" },
  { role: "readonly", telegramId: "900000002", name: "Sendbox Viewer" },
  { role: "seller", telegramId: "900000003", name: "Test Seller One" },
  { role: "salon_manager", telegramId: "900000004", name: "Salon Manager Test" },
  { role: "company_admin", telegramId: "900000005", name: "Company Admin Test" },
  { role: "super_admin", telegramId: "900000006", name: "Super Admin Test" },
];

export function isSendboxMockAuth(): boolean {
  return process.env.SENDBOX_MOCK_AUTH === "1";
}

export function getSendboxTestUser(role: SendboxRole): SendboxTestUser | undefined {
  return SENDBOX_TEST_USERS.find((u) => u.role === role);
}

/**
 * Build a fake Telegram initData string for a test user.
 * The sendbox auth resolver reads this instead of verifying HMAC.
 */
export function buildMockInitData(user: SendboxTestUser): string {
  const params = new URLSearchParams({
    auth_date: String(Math.floor(Date.now() / 1000)),
    hash: "sendbox_mock_hash",
    id: user.telegramId,
    first_name: user.name.split(" ")[0],
    last_name: user.name.split(" ").slice(1).join(" ") || "",
    username: user.name.toLowerCase().replace(/\s+/g, "_"),
  });
  return params.toString();
}

/** Header name for injecting test user in API requests. */
export const SENDBOX_USER_HEADER = "x-sendbox-test-user";

/**
 * Resolve test user from request headers (API routes) or initData (client).
 * Returns null if mock auth is disabled or no valid user found.
 */
export function resolveSendboxUser(headerValue?: string | null): SendboxTestUser | null {
  if (!isSendboxMockAuth()) return null;
  if (!headerValue) return null;
  // Accept role name or telegram ID
  const byRole = SENDBOX_TEST_USERS.find(
    (u) => u.role === headerValue.toLowerCase()
  );
  if (byRole) return byRole;
  const byId = SENDBOX_TEST_USERS.find((u) => u.telegramId === headerValue);
  if (byId) return byId;
  return null;
}
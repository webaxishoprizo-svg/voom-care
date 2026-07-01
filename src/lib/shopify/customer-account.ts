// Shopify Customer Account API – OAuth 2.0 (PKCE) helper layer.
// Docs: https://shopify.dev/docs/api/customer
import { SHOPIFY_CONFIG } from "./client";

const SHOP_ID = SHOPIFY_CONFIG.shopId;
// Customer Account API version (independent of Storefront API version).
const CUSTOMER_API_VERSION = "2024-10";

export const CUSTOMER_OAUTH = {
  authorize: `https://shopify.com/authentication/${SHOP_ID}/oauth/authorize`,
  token: `https://shopify.com/authentication/${SHOP_ID}/oauth/token`,
  logout: `https://shopify.com/authentication/${SHOP_ID}/logout`,
  graphql: `https://shopify.com/${SHOP_ID}/account/customer/api/${CUSTOMER_API_VERSION}/graphql`,
  clientId: SHOPIFY_CONFIG.publicClientId,
  // Scope per Shopify docs. `openid email` are required, `customer-account-api:full` grants Customer API access.
  scope: "openid email customer-account-api:full",
};

export const STORAGE = {
  accessToken: "voom_customer_access_token",
  refreshToken: "voom_customer_refresh_token",
  idToken: "voom_customer_id_token",
  expiresAt: "voom_customer_expires_at",
  verifier: "voom_pkce_verifier",
  state: "voom_oauth_state",
  redirectAfter: "voom_redirect_after_login",
};

function base64UrlEncode(buf: ArrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function randomString(len = 64) {
  const arr = new Uint8Array(len);
  crypto.getRandomValues(arr);
  return base64UrlEncode(arr.buffer);
}

async function sha256(str: string) {
  const data = new TextEncoder().encode(str);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return base64UrlEncode(hash);
}

export function getRedirectUri() {
  return `${window.location.origin}/auth/callback`;
}

/** Begin login: build PKCE pair, persist verifier + state, redirect to Shopify. */
export async function beginLogin(returnTo = window.location.pathname) {
  const verifier = randomString(64);
  const state = randomString(16);
  const challenge = await sha256(verifier);

  sessionStorage.setItem(STORAGE.verifier, verifier);
  sessionStorage.setItem(STORAGE.state, state);
  sessionStorage.setItem(STORAGE.redirectAfter, returnTo);

  const params = new URLSearchParams({
    scope: CUSTOMER_OAUTH.scope,
    client_id: CUSTOMER_OAUTH.clientId,
    response_type: "code",
    redirect_uri: getRedirectUri(),
    state,
    code_challenge: challenge,
    code_challenge_method: "S256",
  });
  window.location.href = `${CUSTOMER_OAUTH.authorize}?${params.toString()}`;
}

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  id_token?: string;
  expires_in: number;
  token_type: string;
}

/** Handle /auth/callback: exchange `code` for access + refresh tokens. */
export async function handleCallback(search: string) {
  const params = new URLSearchParams(search);
  const code = params.get("code");
  const state = params.get("state");
  const expectedState = sessionStorage.getItem(STORAGE.state);
  const verifier = sessionStorage.getItem(STORAGE.verifier);

  if (!code || !state || state !== expectedState || !verifier) {
    throw new Error("Invalid OAuth callback (state/code mismatch).");
  }

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: CUSTOMER_OAUTH.clientId,
    redirect_uri: getRedirectUri(),
    code,
    code_verifier: verifier,
  });

  const res = await fetch(CUSTOMER_OAUTH.token, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Token exchange failed (${res.status}): ${txt}`);
  }

  const data = (await res.json()) as TokenResponse;
  persistTokens(data);

  const returnTo = sessionStorage.getItem(STORAGE.redirectAfter) || "/account";
  sessionStorage.removeItem(STORAGE.verifier);
  sessionStorage.removeItem(STORAGE.state);
  sessionStorage.removeItem(STORAGE.redirectAfter);
  return returnTo;
}

function persistTokens(data: TokenResponse) {
  const expiresAt = Date.now() + data.expires_in * 1000;
  localStorage.setItem(STORAGE.accessToken, data.access_token);
  localStorage.setItem(STORAGE.refreshToken, data.refresh_token);
  if (data.id_token) localStorage.setItem(STORAGE.idToken, data.id_token);
  localStorage.setItem(STORAGE.expiresAt, String(expiresAt));
}

function getLogoutRedirectUri() {
  return `${window.location.origin}/`;
}

export function clearTokens() {
  Object.values(STORAGE).forEach((k) => {
    localStorage.removeItem(k);
    sessionStorage.removeItem(k);
  });
}

export function getAccessToken() {
  return localStorage.getItem(STORAGE.accessToken);
}

export function isAuthenticated() {
  const t = getAccessToken();
  const exp = Number(localStorage.getItem(STORAGE.expiresAt) || 0);
  return Boolean(t) && Date.now() < exp;
}

/** Refresh the access token using the refresh token. Returns new access token or null. */
export async function refreshAccessToken(): Promise<string | null> {
  const refresh = localStorage.getItem(STORAGE.refreshToken);
  if (!refresh) return null;
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: CUSTOMER_OAUTH.clientId,
    refresh_token: refresh,
  });
  const res = await fetch(CUSTOMER_OAUTH.token, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) {
    clearTokens();
    return null;
  }
  const data = (await res.json()) as TokenResponse;
  persistTokens(data);
  return data.access_token;
}

/** Logout: revokes session on Shopify and clears tokens. */
export function logout() {
  const idToken = localStorage.getItem(STORAGE.idToken);
  clearTokens();
  if (!idToken) {
    window.location.assign("/");
    return;
  }

  const params = new URLSearchParams({
    client_id: CUSTOMER_OAUTH.clientId,
    post_logout_redirect_uri: getLogoutRedirectUri(),
  });
  params.set("id_token_hint", idToken);
  window.location.href = `${CUSTOMER_OAUTH.logout}?${params.toString()}`;
}

interface GqlResponse<T> {
  data?: T;
  errors?: Array<{ message: string; extensions?: { code?: string } }>;
}

/** Thrown when the customer session is missing, expired, or rejected by Shopify. */
export class CustomerAuthError extends Error {
  constructor(
    message = "Your session has expired. Please sign in again.",
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = "CustomerAuthError";
  }
}

function isAuthErrorMessage(msg: string) {
  return /unauthorized|unauthenticated|access\s*token|not\s*authenticated|invalid\s*token|expired/i.test(
    msg,
  );
}

/** Customer Account API GraphQL query, with auto-refresh on 401. */
export async function customerQuery<T>(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<T> {
  const token = getAccessToken();
  if (!token) throw new CustomerAuthError("You're signed out. Please sign in to continue.");

  const doFetch = (t: string) =>
    fetch(CUSTOMER_OAUTH.graphql, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: t,
      },
      body: JSON.stringify({ query, variables }),
    });

  let res: Response;
  try {
    res = await doFetch(token);
  } catch (e) {
    throw new Error("Network error – please check your connection and try again.");
  }

  if (res.status === 401 || res.status === 403) {
    const refreshed = await refreshAccessToken();
    if (!refreshed) {
      clearTokens();
      throw new CustomerAuthError();
    }
    try {
      res = await doFetch(refreshed);
    } catch {
      throw new Error("Network error – please check your connection and try again.");
    }
    if (res.status === 401 || res.status === 403) {
      clearTokens();
      throw new CustomerAuthError();
    }
  }

  if (!res.ok) {
    throw new Error(`We couldn't load your account right now (${res.status}). Please try again.`);
  }

  let payload: GqlResponse<T>;
  try {
    payload = (await res.json()) as GqlResponse<T>;
  } catch {
    throw new Error("Unexpected response from server. Please try again.");
  }

  if (payload.errors?.length) {
    const first = payload.errors[0];
    if (first.extensions?.code === "UNAUTHENTICATED" || isAuthErrorMessage(first.message)) {
      clearTokens();
      throw new CustomerAuthError();
    }
    throw new Error(first.message);
  }
  return payload.data!;
}

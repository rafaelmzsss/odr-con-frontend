import { ApiError, ENDPOINTS, request, setAuthTokenProvider } from "./api";

// Access token lives in memory only and is cleared when the page reloads or user signs out.
let accessToken = null;
setAuthTokenProvider(() => accessToken);

function parseSession(data) {
  const token = data?.accessToken ?? data?.token;
  const user = data?.user ?? data?.usuario ?? data;
  if (typeof token !== "string" || !token.trim() || !user || typeof user !== "object") {
    throw new ApiError("invalid_response");
  }
  accessToken = token;
  return {
    token,
    role: user.role ?? user.perfil,
    name: user.fullName ?? user.nome ?? user.name ?? "",
    email: user.email ?? "",
    user,
  };
}

export async function login({ email, password, role }) {
  return parseSession(await request(ENDPOINTS.authLogin, {
    body: { email: email.trim().toLowerCase(), password, role },
  }));
}

export async function register({ email, password, role, fullName }) {
  return parseSession(await request(ENDPOINTS.authRegister, {
    body: { email: email.trim().toLowerCase(), password, role, fullName },
  }));
}

export function recoverPassword(email) {
  return request(ENDPOINTS.authRecover, { body: { email: email.trim().toLowerCase() } })
    .then((data) => {
      if (data?.status === "not_configured") {
        throw new ApiError("recovery_not_configured");
      }
      return data;
    });
}

export function logout() {
  accessToken = null;
}

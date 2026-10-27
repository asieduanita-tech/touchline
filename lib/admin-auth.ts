import "server-only";

function safeEqual(left: string, right: string) {
  const leftBytes = new TextEncoder().encode(left);
  const rightBytes = new TextEncoder().encode(right);
  const length = Math.max(leftBytes.length, rightBytes.length);
  let difference = leftBytes.length ^ rightBytes.length;
  for (let index = 0; index < length; index += 1) {
    difference |= (leftBytes[index] ?? 0) ^ (rightBytes[index] ?? 0);
  }
  return difference === 0;
}

export function isAdminRequest(request: Request) {
  const expectedUser = process.env.TOUCHLINE_ADMIN_USER;
  const expectedPassword = process.env.TOUCHLINE_ADMIN_PASSWORD;
  const authorization = request.headers.get("authorization");
  if (!expectedUser || !expectedPassword || !authorization?.startsWith("Basic ")) return false;

  try {
    const decoded = atob(authorization.slice(6));
    const separator = decoded.indexOf(":");
    if (separator < 0) return false;
    return safeEqual(decoded.slice(0, separator), expectedUser) &&
      safeEqual(decoded.slice(separator + 1), expectedPassword);
  } catch {
    return false;
  }
}

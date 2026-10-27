import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

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

export function proxy(request: NextRequest) {
  const expectedUser = process.env.TOUCHLINE_ADMIN_USER;
  const expectedPassword = process.env.TOUCHLINE_ADMIN_PASSWORD;
  const authorization = request.headers.get("authorization");
  let authorised = false;

  if (expectedUser && expectedPassword && authorization?.startsWith("Basic ")) {
    try {
      const decoded = atob(authorization.slice(6));
      const separator = decoded.indexOf(":");
      authorised = separator >= 0 &&
        safeEqual(decoded.slice(0, separator), expectedUser) &&
        safeEqual(decoded.slice(separator + 1), expectedPassword);
    } catch {
      authorised = false;
    }
  }

  if (!authorised) {
    return new NextResponse("Touchline owner access required.", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Touchline admin", charset="UTF-8"',
        "Cache-Control": "no-store"
      }
    });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"]
};

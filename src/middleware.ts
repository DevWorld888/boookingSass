// export { default } from "next-auth/middleware";
import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

interface AuthRequest {
  auth?: unknown;
  nextUrl: {
    pathname: string;
  };
  url: string;
}

type AuthHandler = (req: AuthRequest) => NextResponse;

export default auth((req: AuthRequest): NextResponse => {
  const isLoggedIn: boolean = !!req.auth;
  const isOnDashboard: boolean = req.nextUrl.pathname.startsWith('/dashboard');
  const isOnLogin: boolean = req.nextUrl.pathname.startsWith('/signin');

  // Si está en el dashboard y no está logueado, redirigir a login
  if (isOnDashboard && !isLoggedIn) {
    return NextResponse.redirect(new URL('/signin', req.url));
  }

  // Si está en login y ya está logueado, redirigir a dashboard
  if (isOnLogin && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
});

// protege todas estas rutas
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/bookings/:path*",
    "/services/:path*",
    "/resources/:path*",
    "/customers/:path*",
    "/settings/:path*",
    // Excluye archivos estáticos y API routes que no necesitan protección
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

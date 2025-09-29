export { default } from "next-auth/middleware";

// protege todas estas rutas
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/bookings/:path*",
    "/services/:path*",
    "/resources/:path*",
    "/customers/:path*",
    "/settings/:path*",
  ],
};

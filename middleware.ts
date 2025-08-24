import { withAuth } from "next-auth/middleware";

// Protect authenticated areas and redirect unauthenticated users to custom sign-in page
export default withAuth({
  pages: {
    signIn: "/auth/signin",
  },
});

// Match only app pages that require authentication
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/projects/:path*",
    "/studies/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/admin/:path*",
    "/performance-test/:path*",
  ],
};

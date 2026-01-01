import { NextRequest, NextResponse } from 'next/server';

function isAuthenticated(request: NextRequest): boolean {
  // Sahi cookie name jo humne FastAPI backend mein set kiya hai
  const authCookie = request.cookies.get('better-auth.session_token');
  
  // Debugging ke liye (Aap terminal mein dekh sakenge cookie mil rahi hai ya nahi)
  if (authCookie) {
    console.log("Middleware: Session found");
    return true;
  }

  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return true;
  }

  return false;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protected routes
  const protectedRoutes = ['/dashboard', '/api/tasks']; 
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // Public/Auth routes
  const isAuthRoute = pathname.startsWith('/signin') || pathname.startsWith('/signup');

  const loggedIn = isAuthenticated(request);

  // 1. Agar protected route hai aur login nahi hai -> Redirect to Signin
  if (isProtectedRoute && !loggedIn) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  // 2. Agar login hai aur signin/signup page par hai -> Redirect to Dashboard
  if (isAuthRoute && loggedIn) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};






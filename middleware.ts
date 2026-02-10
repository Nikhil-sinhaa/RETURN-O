// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware for protecting Sanity Studio with HTTP Basic Auth
 * 
 * This ensures only authorized users can access /studio
 * Credentials are stored in environment variables
 */

// Routes that require authentication
const PROTECTED_ROUTES = ['/studio'];

// Check if the request path starts with any protected route
function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(route => pathname.startsWith(route));
}

// Validate Basic Auth credentials
function validateCredentials(authHeader: string | null): boolean {
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return false;
  }

  const base64Credentials = authHeader.split(' ')[1] || '';
  const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
  const [username, password] = credentials.split(':');

  // Expected credentials
  const expectedUsername = process.env.STUDIO_USERNAME || 'admin';
  const expectedPassword = process.env.STUDIO_PASSWORD || 'return0_iiitdwd_admin_2025';

  return username === expectedUsername && password === expectedPassword;
}

// Create unauthorized response
function unauthorizedResponse(): NextResponse {
  return new NextResponse('Authentication required to access Sanity Studio', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="RETURN 0; Studio", charset="UTF-8"',
      'Content-Type': 'text/plain',
    },
  });
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect studio routes
  if (!isProtectedRoute(pathname)) {
    return NextResponse.next();
  }

  // Check for Authorization header
  const authHeader = request.headers.get('authorization');

  // Validate credentials
  if (!validateCredentials(authHeader)) {
    return unauthorizedResponse();
  }

  // Allow access if credentials are valid
  return NextResponse.next();
}

export const config = {
  // Match all studio routes
  matcher: ['/studio/:path*'],
};
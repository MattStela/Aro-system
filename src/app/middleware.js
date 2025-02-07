import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function middleware(request) {
  const token = request.cookies.get('jwtToken');

  if (!token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET_KEY);
    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL('/', request.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*'],
};

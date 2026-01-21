import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();

  // 1. Forward login request to Laravel
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(data, { status: res.status });
  }

  // 2. Prepare the response body with user data
  // Assuming your Laravel response looks like: { data: { access_token: '...', user: {...} } }
  const response = NextResponse.json({ 
    message: 'Login successful',
    user: data.data.user // This sends user info back to the frontend
  });

  // 3. Set the token in a secure httpOnly cookie
  response.cookies.set('session_token', data.data.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });

  return response;
}
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;

  // 1. (Optional) Tell Laravel to revoke the token
  if (token) {
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });
  }

  // 2. Clear the cookie from the browser
  const response = NextResponse.json({ message: 'Logged out successfully' });
  
  // To delete a cookie, we set it with an expired date
  response.cookies.set('session_token', '', {
    httpOnly: true,
    expires: new Date(0), // Sets expiration to the past
    path: '/',
  });

  return response;
}
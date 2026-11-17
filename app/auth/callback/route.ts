import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  // Handle errors sent directly by Supabase in query params (e.g., expired recovery links)
  if (error || errorDescription) {
    const errorMsg = encodeURIComponent(errorDescription || error || 'Authentication error');
    if (next.includes('reset-password')) {
      return NextResponse.redirect(`${origin}/auth/reset-password?error=${errorMsg}`);
    }
    return NextResponse.redirect(`${origin}/auth/login?error=${errorMsg}`);
  }

  if (code) {
    const supabase = await createClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (!exchangeError) {
      return NextResponse.redirect(`${origin}${next}`);
    } else {
      const errorMsg = encodeURIComponent(exchangeError.message || 'Invalid or expired recovery link');
      if (next.includes('reset-password')) {
        return NextResponse.redirect(`${origin}/auth/reset-password?error=${errorMsg}`);
      }
      return NextResponse.redirect(`${origin}/auth/login?error=${errorMsg}`);
    }
  }

  // Fallback if no code is present
  return NextResponse.redirect(`${origin}/auth/login?error=Could+not+authenticate`);
}

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const redirectTo = (await cookies()).get('redirectTo');

  if (code) {
    const supabase = createClient();
    await (await supabase).auth.exchangeCodeForSession(code);
  }
  // Clear the cookie after retrieval
  (
    await // Clear the cookie after retrieval
    cookies()
  ).delete('redirectTo');

  if (redirectTo?.value && redirectTo?.value !== '[object FormData]') {
    return NextResponse.redirect(redirectTo.value);
  } else {
    const fallbackUrl = new URL('/', origin);
    // fallbackUrl.search = '?tab=videos&sort=desc&type=all';
    return NextResponse.redirect(fallbackUrl); // Default fallback
  }
}

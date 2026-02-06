'use server';
import { redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';
import { objectToQueryString } from '@/lib/utils';
import { revalidatePath } from 'next/cache';
import { cookies, headers } from 'next/headers';

const getURL = () => {
  let url = process?.env?.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000/';

  url = url.startsWith('http') ? url : `https://${url}`;

  url = url.endsWith('/') ? url : `${url}/`;
  return url;
};

export async function signInWithGoogle(redirectTo?: string) {
  if (redirectTo) {
    (await cookies()).set('redirectTo', redirectTo, {
      path: '/',
      httpOnly: true,
    });
  }
  const origin = (await headers()).get('origin');

  const supabase = createClient();
  const {
    data: { url },
    error,
  } = await (
    await supabase
  ).auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    const data = {
      title: 'Error!',
      description: 'Could not authenticate user. Please try again!',
      type: 'message',
    };
    return redirect('/signin?' + objectToQueryString(data));
  }
  revalidatePath(url as string, 'layout');
  return redirect(url as string);
}

export const signOut = async () => {
  const supabase = createClient();
  await (await supabase).auth.signOut();
  const data = {
    title: 'Logged Out Successfully!',
    description: 'You have been logged out!',
    type: 'message',
  };
  return redirect('/signin?' + objectToQueryString(data));
};
export async function signInWithEmail2(email: string) {
  const supabase = createClient();

  const { error } = await (
    await supabase
  ).auth.signInWithOtp({
    email,

    options: {
      emailRedirectTo: getURL() + 'auth/callback',
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { success: 'Check your email for the Magic Link !' };
}

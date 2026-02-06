import React from 'react';

interface Props {
  children: React.ReactNode;
}

export const metadata = {
  title: 'Sign in',
};

export default function AuthLayout({ children }: Props) {
  return (
    <main className="mx-auto h-screen w-full overflow-hidden">{children}</main>
  );
}

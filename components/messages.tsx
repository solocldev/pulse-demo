'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

export default function Messages() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type');
  const title = searchParams.get('title') || 'Notification';
  const description = searchParams.get('description') || '';

  const router = useRouter();

  useEffect(() => {
    if (!type) return;

    if (type === 'error') {
      toast.error(title, { description });
      router.replace('/signin');
    }

    if (type === 'message') {
      toast.success(title, { description });
      router.replace(window.location.pathname);
      router.refresh();
    }
  }, [type, title, description, router]);

  return null;
}

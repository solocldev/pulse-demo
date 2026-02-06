'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { signInWithEmail2 } from './action';

export default function EmailMagicLinkSignIn() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    setLoading(true);

    const result = await signInWithEmail2(email);

    if (result.error) {
      toast.error(result.error);
      setMessage(result.error);
    } else if (result.success) {
      toast.success(result.success);
      setMessage(result.success);
    }

    setLoading(false);
  }

  return (
    <Card className="mx-auto w-full border-none p-0 shadow-none">
      <CardContent className="p-0">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <CardDescription className="text-center">
              Enter your email to receive a Magic link.
            </CardDescription>
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={!email.trim() || loading}>
            Send Magic Link
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        {message && (
          <Alert className="mt-2">
            <Mail className="size-4" />
            <AlertDescription className="mb-0 mt-1">{message}</AlertDescription>
          </Alert>
        )}
      </CardFooter>
    </Card>
  );
}

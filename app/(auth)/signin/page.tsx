'use client';

import Image from 'next/image';

import Messages from '@/components/messages';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { Suspense } from 'react';
import { signInWithGoogle } from './action';
import EmailOTPSignIn from './EmailOtp';

export default function SignInPage() {
  // const params = useSearchParams();
  // const [toastFlag, setToastFlag] = useState<boolean>(false);
  // const router = useRouter();
  // const success = params.get('success');
  // const error = params.get('error');
  // const toast = useToast();
  // if (success && !toastFlag) {
  //   toast.toast({
  //     title: 'Email sent successfully!',
  //     description: 'Please check your email.',
  //     variant: 'success',
  //   });
  //   setToastFlag(true);
  //   router.push('/login');
  // }
  // if (error && !toastFlag) {
  //   toast.toast({
  //     title: 'Error sending email!',
  //     description: 'Please try again or login with Google',
  //     variant: 'destructive',
  //   });
  //   setToastFlag(true);
  //   router.push('/login');
  // }

  const handleSignInWithGoogle = async (e: React.FormEvent) => {
    e.preventDefault();
    await signInWithGoogle();
  };

  return (
    <div className="container grid h-screen w-screen items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="hidden size-full p-5 lg:flex">
        <Image
          src="/art.webp"
          className="size-full rounded-md object-cover"
          alt="Illustration"
          height={100}
          width={100}
          unoptimized
          quality={100}
          priority
        />
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-10 sm:w-[500px]">
          <div className="flex flex-col items-center justify-center">
            <Image
              src="/art.webp"
              className="mb-10 size-60 rounded-md object-cover lg:mb-0 lg:hidden"
              alt="Illustration"
              height={10}
              width={10}
              unoptimized
              quality={100}
              priority
            />
            <h1 className="font-heading text-5xl font-bold tracking-tighter text-black dark:text-white">
              Welcome!
            </h1>
            <p className="font-heading mt-1 text-xl text-black/70 dark:text-gray-300">
              Please login to access your account
            </p>
          </div>
          <div>
            <form className="w-full">
              <Button
                className="font-heading mx-auto flex h-auto w-full items-center gap-2 px-10 py-2 text-lg font-semibold"
                onClick={handleSignInWithGoogle}>
                <svg className="size-6" viewBox="-0.5 0 48 48">
                  <path
                    d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24"
                    fill="#FBBC05"
                  />
                  <path
                    d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333"
                    fill="#EB4335"
                  />
                  <path
                    d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667"
                    fill="#34A853"
                  />
                  <path
                    d="M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24"
                    fill="#4285F4"
                  />
                </svg>
                Login with Google
              </Button>
            </form>

            <div className="relative mx-auto mt-1 flex w-4/5 items-center justify-center space-x-2 py-4">
              <Separator className="flex-1" />
              <span className="text-xs uppercase text-muted-foreground">
                Or continue with
              </span>
              <Separator className="flex-1" />
            </div>

            <EmailOTPSignIn />
          </div>
        </div>
      </div>
      <div className="absolute right-4 top-3 scale-90 items-center justify-center px-3 py-2">
        <Link href="/">
          <Button className="flex h-auto items-center gap-2 py-2 text-lg font-medium">
            <svg
              viewBox="0 0 24 24"
              className="size-6 text-white dark:text-black">
              <path
                d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.18C2 19.83 4.17 22 7.81 22H16.18C19.82 22 21.99 19.83 21.99 16.19V7.81C22 4.17 19.83 2 16.19 2ZM13.92 16.13H9C8.59 16.13 8.25 15.79 8.25 15.38C8.25 14.97 8.59 14.63 9 14.63H13.92C15.2 14.63 16.25 13.59 16.25 12.3C16.25 11.01 15.21 9.97 13.92 9.97H8.85L9.11 10.23C9.4 10.53 9.4 11 9.1 11.3C8.95 11.45 8.76 11.52 8.57 11.52C8.38 11.52 8.19 11.45 8.04 11.3L6.47 9.72C6.18 9.43 6.18 8.95 6.47 8.66L8.04 7.09C8.33 6.8 8.81 6.8 9.1 7.09C9.39 7.38 9.39 7.86 9.1 8.15L8.77 8.48H13.92C16.03 8.48 17.75 10.2 17.75 12.31C17.75 14.42 16.03 16.13 13.92 16.13Z"
                fill="currentColor"
              />
            </svg>
            Back
          </Button>
        </Link>
      </div>
      <Suspense>
        <Messages />
      </Suspense>
    </div>
  );
}

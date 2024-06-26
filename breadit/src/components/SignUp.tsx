import { FC } from 'react';
import { Icons } from './Icons';
import Link from 'next/link';
import UserAuthForm from './UserAuthForm';

const SignUp: FC = () => {
  return (
    <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
      <div className="flex flex-col space-y-2 text-center">
        <Icons.logo className="w-6 h-6 mx-auto" />
        <h1 className="text-2xl font-semibold tracking-tight">Sign Up</h1>
        <p className="max-w-xs mx-auto text-sm">
          By continuing, you are setting up a Breadit account and agree to our
          User Agreement and Privacy Policy
        </p>
        {/*Sign-in Form*/}
        <UserAuthForm />
        <p className="px-8 text-sm text-center text-zinc-700">
          Already a Member?{' '}
          <Link
            href="/sign-in"
            className="text-sm underline hover:text-zinc-800 underline-offset-4"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;

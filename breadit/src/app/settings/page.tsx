export const metadata = {
  title: 'Settings',
  description: 'Manage account and website settings.'
};

import UserNameForm from '@/components/UserNameForm';
import { authOptions, getAuthSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

const page = async ({}) => {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect(authOptions.pages?.signIn || '/sign-in');
  }
  return (
    <div className="max-w-4xl py-12 mx-auto ">
      <div className="gap-8 grid-items-start ">
        <h1 className="mb-1 text-3xl font-bold md:text-4xl">Settings</h1>
      </div>
      <div className="grid gap-10">
        <UserNameForm
          user={{
            id: session.user.id,
            username: session.user.username || ''
          }}
        />
      </div>
    </div>
  );
};

export default page;

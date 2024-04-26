export const metadata = {
  title: 'Settings',
  description: 'Manage account and website settings.'
};

import { authOptions, getAuthSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { FC } from 'react';

const page = async ({}) => {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect(authOptions.pages?.signIn || '/sign-in');
  }
  return <div>page</div>;
};

export default page;

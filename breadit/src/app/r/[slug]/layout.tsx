import { Button, buttonVariants } from '@/components/ui/Button';
import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import format from 'date-fns/format';
import SubscribeLeaveToggle from '@/components/SubscribeLeaveToggle';
import Link from 'next/link';

const Layout = async ({
  children,
  params: { slug }
}: {
  children: React.ReactNode;
  params: { slug: string };
}) => {
  const session = await getAuthSession();

  const subreddit = await db.subreddit.findFirst({
    where: {
      name: slug
    },
    include: {
      posts: {
        include: {
          author: true,
          votes: true
        }
      }
    }
  });

  const subscription = !session?.user
    ? undefined
    : await db.subscription.findFirst({
        where: {
          subreddit: { name: slug },
          user: {
            id: session.user.id
          }
        }
      });

  const isSubscribed = !!subscription;

  if (!subreddit) return notFound();

  const memberCount = await db.subscription.count({
    where: {
      subreddit: {
        name: slug
      }
    }
  });

  return (
    <div className="h-full pt-12 mx-auto sm:container max-w-7xl">
      <div>
        {/* <Button></Button> */}
        <div className="grid grid-cols-1 py-6 md:grid-cols-3 gap-y-4 md:gap-x-4">
          <div className="flex flex-col col-span-2 space-y-6">{children}</div>
          {/*info sidebar */}
          <div className="order-first hidden overflow-hidden border border-gray-200 rounded-lg md:block h-fit md:order-last">
            <div className="px-6 py-4">
              <p className="py-3 font-semibold">About r/{subreddit.name}</p>
            </div>

            <dl className="px-6 py-4 text-sm leading-6 bg-white divide-y divide-gray-100">
              <div className="flex justify-between py-3 gap-x-4">
                <dt className="text-gray-500">Created</dt>
                <dd className="text-gray-700 ">
                  {' '}
                  <time dateTime={subreddit.createdAt.toDateString()}>
                    {format(subreddit.createdAt, 'MMMM d, yyyy')}
                  </time>
                </dd>
              </div>

              <div className="flex justify-between py-3 gap-x-4">
                {' '}
                <dt className="text-gray-500">Members</dt>
                <dd className="text-gray-700 ">
                  <div className="text-gray-900">{memberCount}</div>
                </dd>
              </div>
              <div>
                {subreddit.creatorId === session?.user.id ? (
                  <div className="flex justify-between py-3 gap-x-4">
                    {' '}
                    <p className="text-gray-500">
                      You created this community
                    </p>{' '}
                  </div>
                ) : null}

                {subreddit.creatorId !== session?.user.id ? (
                  <SubscribeLeaveToggle
                    subredditId={subreddit.id}
                    subredditName={subreddit.name}
                    isSubscribed={isSubscribed}
                  />
                ) : null}

                <Link
                  className={buttonVariants({
                    variant: 'outline',
                    className: 'w-full mb-6'
                  })}
                  href={`r/${slug}/submit`}
                >
                  Create Post
                </Link>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;

'use client';

import { FC, useRef, useState } from 'react';
import UserAvatar from './ui/UserAvatar';
import { Comment, CommentVote, User } from '@prisma/client';
import { formatTimeToNow } from '@/lib/utils';
import CommentVotes from './CommentVotes';
import { Button } from './ui/Button';
import { MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Label } from './ui/Label';
import { Textarea } from './ui/Textarea';
import { useMutation } from '@tanstack/react-query';
import { CommentRequest } from '@/lib/validators/comment';
import axios from 'axios';
import { toast } from '@/hooks/use-toast';

type ExtendedComment = Comment & {
  votes: CommentVote[];
  author: User;
};
interface PostCommentProps {
  comment: ExtendedComment;
  votesAmt: number;
  currentVote: CommentVote | undefined;
  postId: string;
}

const PostComment: FC<PostCommentProps> = ({
  comment,
  votesAmt,
  currentVote,
  postId
}) => {
  const commentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { data: session } = useSession();
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');

  const { mutate: postComment, isLoading } = useMutation({
    mutationFn: async ({ postId, text, replyToId }: CommentRequest) => {
      const payload: CommentRequest = {
        postId,
        text,
        replyToId
      };
      const { data } = await axios.patch(
        '/api/subreddit/post/comment',
        payload
      );
      return data;
    },
    onError: () => {
      return toast({
        title: 'Something went wrong',
        description: 'Comment not posted successfully, please try again later.',
        variant: 'destructive'
      });
    },
    onSuccess: () => {
      router.refresh();
      setIsReplying(false);
    }
  });

  return (
    <div className="flex flex-col" ref={commentRef}>
      <div className="flex items-center">
        <UserAvatar
          user={{
            name: comment.author.name || null,
            image: comment.author.image || null
          }}
          className="w-6 h-6"
        />
        <div className="flex ml-2 item-center gap-x-2">
          <p className="text-sm font-medium text-gray-900">
            u/{comment.author.username}
          </p>
          <p className="text-xs truncate max-h-40 text-zinc-500 ">
            {formatTimeToNow(new Date(comment.createdAt))}
          </p>
        </div>
      </div>
      <p className="mt-2 text-sm text-zinc-900">{comment.text}</p>

      <div className="flex flex-wrap items-center gap-2">
        <CommentVotes
          commentId={comment.id}
          initialVote={currentVote}
          initialVotesAmt={votesAmt}
        />

        <Button
          onClick={() => {
            if (!session) return router.push('/sign-in');
            setIsReplying(true);
          }}
          variant="ghost"
          size="xs"
        >
          <MessageSquare className="w-4 h-4 mr-1.5" />
          Reply
        </Button>

        {isReplying ? (
          <div className="grid w-full gap-1.5">
            <Label htmlFor="comment">Your Comment</Label>
            <div className="mt-2">
              <Textarea
                id="comment"
                value={input}
                onChange={e => setInput(e.target.value)}
                rows={1}
                placeholder="What are your thoughts?"
              />
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <Button
                tabIndex={-1}
                variant="subtle"
                onClick={() => setIsReplying(false)}
              >
                Cancel
              </Button>
              <Button
                isLoading={isLoading}
                disabled={input.length === 0}
                onClick={() => {
                  if (!input) return;
                  postComment({
                    postId,
                    text: input,
                    replyToId: comment.replyToId ?? comment.id
                  });
                }}
              >
                Post
              </Button>{' '}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default PostComment;

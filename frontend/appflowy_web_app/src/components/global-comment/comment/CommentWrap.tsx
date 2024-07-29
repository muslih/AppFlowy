import { AFConfigContext } from '@/components/app/AppConfig';
import CommentActions from '@/components/global-comment/actions/CommentActions';
import Comment from './Comment';
import { useGlobalCommentContext } from '@/components/global-comment/GlobalComment.hooks';
import ReplyComment from '@/components/global-comment/ReplyComment';
import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import smoothScrollIntoViewIfNeeded from 'smooth-scroll-into-view-if-needed';

export interface CommentWrapProps {
  commentId: string;
  isHovered: boolean;
  onHovered: () => void;
}

export function CommentWrap({ commentId, isHovered, onHovered }: CommentWrapProps) {
  const { getComment } = useGlobalCommentContext();
  const comment = useMemo(() => getComment(commentId), [commentId, getComment]);
  const ref = React.useRef<HTMLDivElement>(null);
  const [highLight, setHighLight] = React.useState(false);
  const isAuthenticated = useContext(AFConfigContext)?.isAuthenticated;

  useEffect(() => {
    const hashHasComment = window.location.hash.includes(`#comment-${commentId}`);

    if (!hashHasComment) return;
    const element = ref.current;

    if (!element) return;
    let timeout: NodeJS.Timeout | null = null;

    void (async () => {
      window.location.hash = '';

      timeout = setTimeout(() => {
        void smoothScrollIntoViewIfNeeded(element, {
          behavior: 'smooth',
          block: 'center',
        });
        setHighLight(true);

        timeout = setTimeout(() => {
          setHighLight(false);
        }, 10000);
      }, 500);
    })();

    return () => {
      timeout && clearTimeout(timeout);
    };
  }, [commentId]);

  const renderReplyComment = useCallback((replyCommentId: string) => {
    return (
      <div className={'relative flex w-full items-center gap-2'}>
        <div className={'reply-line relative top-2 ml-[1.75em] min-w-[28px]'} />
        <div className={'flex-1 overflow-hidden '}> {<ReplyComment commentId={replyCommentId} />}</div>
      </div>
    );
  }, []);

  if (!comment) {
    return null;
  }

  return (
    <div ref={ref} className={'flex flex-col gap-2'} data-comment-id={comment.commentId}>
      {comment.replyCommentId && renderReplyComment(comment.replyCommentId)}
      <div
        className={`relative rounded-[8px] p-2 hover:bg-fill-list-hover ${highLight ? 'blink' : ''}`}
        {...(comment.isDeleted ? { style: { opacity: 0.5 } } : {})}
        onMouseEnter={() => {
          onHovered();
          setHighLight(false);
        }}
      >
        <Comment comment={comment} />
        {isHovered && isAuthenticated && !comment.isDeleted && (
          <div className={'absolute right-2 top-2'}>
            <CommentActions comment={comment} />
          </div>
        )}
      </div>
    </div>
  );
}

export default CommentWrap;

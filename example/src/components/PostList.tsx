import * as React from 'react';
import { db } from '@usedb/core';
import { useDBv2 } from '@usedb/react';
import { observer } from 'mobx-react';
import { db as cacheDB } from '../../dbConfig';

// 1. Pagination types
// 1. Cursor
// 2. Skip/Take

export const PostList = observer(() => {
  const [cursor, setCursor] = React.useState();
  const { data, status } = useDBv2(
    db.actions.getPosts({
      queryKey: 'posts',
      params: { cursor },
    }),
    { fetchPolicy: 'cache-and-network' }
  );

  const loadMore = () => {
    setCursor(data.response.pagination.cursor);
  };

  const isLoadingMore = data && data.pages.length > 0 && status === 'loading';

  if (status === 'loading' && !isLoadingMore) {
    return <div>Loading posts...</div>;
  }

  if (data) {
    const pages = data.pages;

    return (
      <div>
        {pages.map((p: any) => {
          return (
            <div key={p.id}>
              {p.text} by{' '}
              <span style={{ color: 'red' }}>{p.user.username}</span>
              <PostLike post={p} />
              <DeletePostButton post={p} />
            </div>
          );
        })}
        {isLoadingMore ? (
          <div>loading more...</div>
        ) : (
          <button onClick={loadMore}>Load more</button>
        )}
      </div>
    );
  }

  return null;
});

const PostLike = observer(({ post }: any) => {
  const { setQuery, status, data } = useDBv2();
  const prevVal = React.useRef(post.isLiked);
  const handleToggleLike = () => {
    if (status === 'loading') {
      return;
    }
    setQuery(
      db.actions.toggleLikePost({
        params: { id: post.id },
      }),
      { fetchPolicy: 'no-cache' }
    );
  };

  React.useEffect(() => {
    if (status === 'loading') {
      cacheDB._save('Post', {
        ...post,
        isLiked: !post.isLiked,
      });
    } else if (status === 'error') {
      cacheDB._save('Post', {
        ...post,
        isLiked: prevVal.current,
      });
    } else if (status === 'success') {
      prevVal.current = post.isLiked;
    }
  }, [status]);

  return (
    <div>
      <button onClick={handleToggleLike}>
        {post.isLiked ? 'Liked' : 'Like'}
      </button>
    </div>
  );
});

export const DeletePostButton = observer(function DeletePost({ post }: any) {
  const { data, status, setQuery } = useDBv2();

  const handleDeletePost = () => {
    setQuery(db.Post.delete({ where: { id: post.id } }));
  };

  React.useEffect(() => {
    if (status === 'loading') {
      cacheDB.runInAction(() => {
        const currentCache = cacheDB.queryCache.get('posts');
        const pages = currentCache.pages.filter(d => d.id !== post.id);
        cacheDB.queryCache.set('posts', { ...currentCache, pages });
      });
    }
  }, [status]);

  return (
    <div>
      <button onClick={handleDeletePost} disabled={status === 'loading'}>
        Delete Post
      </button>
    </div>
  );
});

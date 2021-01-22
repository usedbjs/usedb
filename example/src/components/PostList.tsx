import * as React from 'react';
import { db } from '@usedb/core';
import { usePaginatedQuery } from '../utils/usePaginatedQuery';
import { useDBv2 } from '@usedb/react';
import { observer } from 'mobx-react';
import { db as cacheDB } from '../../dbConfig';

// pageParams: {}

// What makes pagination different than a normal fetch.
// 1. Page params has to be taken from prev page
// 2.

export const PostList = observer(() => {
  const [offset, setOffset] = React.useState(0);
  const { data: posts, status } = useDBv2(
    db.actions.getPosts({
      queryKey: 'posts',
      append: true,
      params: { limit: 3, offset },
    }),
    { fetchPolicy: 'cache-and-network' }
  );

  const loadMore = () => {
    setOffset(posts.length);
  };

  if (status === 'loading') {
    return <div>Loading posts...</div>;
  }

  if (posts) {
    return (
      <div>
        {posts.map((p: any) => {
          return (
            <div key={p.id}>
              {p.text} by {p.user.username}
              <PostLike post={p} />
              <DeletePostButton post={p} />
            </div>
          );
        })}
        {status === 'loadingMore' ? (
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
  const [value, setValue] = React.useState('');
  const { data, status, setQuery } = useDBv2();

  const handleDeletePost = () => {
    setQuery(db.actions.deletePost(), { fetchPolicy: 'no-cache' });
  };

  React.useEffect(() => {
    if (status === 'loading') {
      cacheDB.runInAction(() => {
        const currentCache = cacheDB.queryCache.get('posts');
        const newCache = currentCache.filter(d => d.id !== post.id);
        cacheDB.queryCache.set('posts', newCache);
      });
    }
    // Mutate cache
    if (status === 'success') {
      cacheDB.runInAction(() => {
        const currentCache = cacheDB.queryCache.get('posts');
        const newCache = currentCache.filter(d => d.id !== post.id);
        cacheDB.queryCache.set('posts', newCache);
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

import * as React from 'react';
import { db } from '@usedb/core';
import { refetchQueries, useDB } from '@usedb/react';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';

export const Test = function Test() {
  const { setQuery, status } = useDB();

  const handleSubmit = () => {
    setQuery(
      db.Post.create({
        data: { title: 'this is a post' },
      })
    );
  };

  useEffect(() => {
    if (status === 'success') {
      refetchQueries(db.Post.collection);
    }
  }, [status]);

  return (
    <div>
      <button disabled={status === 'loading'} onClick={handleSubmit}>
        {status === 'loading' ? 'Creating' : 'Create a Post'}
      </button>
      <PostList />
    </div>
  );
};

const PostList = () => {
  const { data, status, error } = useDB(
    db.Post.findMany({ where: { title: 'this is a post' } })
  );

  if (status === 'loading') {
    return <div>Loading posts...</div>;
  }

  if (status === 'error') {
    return <div>{error.message}</div>;
  }

  if (data) {
    return (
      <div>
        {data.map(item => {
          return (
            <div key={item.id}>
              <PostItem post={item} />
            </div>
          );
        })}
      </div>
    );
  }

  return null;
};

const PostItem = observer(({ post }: any) => {
  const { setQuery, status } = useDB();

  return (
    <div>
      {post.title}
      <button
        onClick={() =>
          setQuery(
            db.Post.update({
              where: { id: post.id },
              data: { title: 'new post' },
            }),
            { optimistic: true }
          )
        }
        disabled={status === 'loading'}
      >
        update title
      </button>
    </div>
  );
});

// Change useDBQuery, useDBMutation -> useDB
// mutate API refactor, pass db.Post.create({ data: { id: '1', title: 'this is a post' } }) in mutate function
// Replace refetch to fetch and add filter function

// Current implementation
// 1. On Create - Refetch all
// 2. On Update - Update single entity on success/optimistic
// 3. On Delete - Refetch all
// 4. On Read - Cache first

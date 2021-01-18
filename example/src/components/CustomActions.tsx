import * as React from 'react';
import { db, QueryData, RuntimeReference } from '@usedb-test/core';
import { refetchQueries, useDB } from 'usedb-react';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';

const normalizer = (db: any) => ({ meta, data }: any) => {
  // 1. Put data in store
  db._save('Author', data, meta);
  // 2. Generate Runtime resolver
  const referenceData = RuntimeReference.create({
    __type: 'Author',
    id: data.authorId,
  });

  return {
    meta,
    data: referenceData,
  };
};

export const CustomActions = function Test() {
  const { status, error, data } = useDB(
    new QueryData(
      'placeholder_name',
      'fetchAuthor',
      { data: { id: '1' } },
      'cache-and-network',
      normalizer
    )
  );

  console.log('status ', status, error, data?.data.name);

  return null;
  //   return (
  //     <div>
  //       <button disabled={status === 'loading'} onClick={handleSubmit}>
  //         {status === 'loading' ? 'Creating' : 'Create a Post'}
  //       </button>
  //       <PostList />
  //     </div>
  //   );
};

const PostList = observer(() => {
  const { data, status, error } = useDB(db.Post.findMany({}));

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
});

const PostItem = observer(({ post }: any) => {
  const { setQuery, status } = useDB();

  useEffect(() => {
    if (status === 'success') {
      refetchQueries(db.Post.collection);
    }
  }, [status]);

  return (
    <div>
      {post.title}
      {post.author?.name}
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

      <button
        onClick={() =>
          setQuery(
            db.Post.delete({
              where: { id: post.id },
            }),
            { optimistic: true }
          )
        }
        disabled={status === 'loading'}
      >
        delete
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

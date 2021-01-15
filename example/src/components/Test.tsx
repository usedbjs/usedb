import { unprotect } from 'mobx-state-tree';
import * as React from 'react';
import { db } from '@usedb/core';
import { useMutation, useQuery } from '@usedb/react';
import { cacheDB } from '../../dbConfig';

export const Test = function Test() {
  const { mutate, refetch, status, error } = useMutation();

  const { data } = useQuery(db.Post.findMany({ where: { id: '1' } }));

  return (
    <div>
      <button
        onClick={() =>
          mutate(db.Post.create({ data: { id: '1', title: 'this is a post' } }))
        }
      >
        Create a Post
      </button>
      <button onClick={() => refetch('Post')}>Refetch All Posts</button>
      {data
        ? data.map(item => {
            return <div key={item.id}>{item.title}</div>;
          })
        : null}
    </div>
  );
};

// Change useQuery, useMutation -> useDB
// mutate API refactor, pass db.Post.create({ data: { id: '1', title: 'this is a post' } }) in mutate function
// Replace refetch to fetch and add filter function

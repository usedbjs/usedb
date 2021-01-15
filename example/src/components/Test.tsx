import * as React from 'react';
import { db } from '@usedb/core';
import { useDBMutation, useDBQuery, refetchQueries } from '@usedb/react';
import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { cacheDB } from '../../dbConfig';

export const Test = function Test() {
  const { mutate, status, data } = useDBMutation();
  const [showPostList, setShowPostList] = useState(false);

  const handleSubmit = async () => {
    try {
      await mutate(
        db.Post.create({
          data: { title: 'this is a post' },
        })
      );

      refetchQueries(db.Post.collection);
    } catch (e) {
      // Do something
    }
  };

  const mountAnotherPostList = () => {
    setShowPostList(true);
  };

  return (
    <div>
      <button disabled={status === 'loading'} onClick={handleSubmit}>
        {status === 'loading' ? 'Creating' : 'Create a Post'}
      </button>
      <h2>Plain old post list</h2>
      <PostList />
      {/* <button onClick={mountAnotherPostList}>Mount another post list</button> */}
      <h4>Reactive Post list</h4>
      <PostListReactive />
    </div>
  );
};

const PostList = () => {
  const { data, status, error } = useDBQuery(
    db.Post.findMany({ where: { title: 'this is a post' } })
  );

  if (status === 'loading') {
    return <div>Loading posts...</div>;
  }

  if (status === 'error') {
    return <div>{error.message}</div>;
  }

  if (data) {
    return data.map(item => {
      return <div key={item.id}>{item.title}</div>;
    });
  }

  return null;
};

const PostListReactive = observer(() => {
  const data = cacheDB.findMany('Post', { where: { title: 'this is a post' } });

  if (data) {
    return data.map(item => {
      return <div key={item.id}>{item.title}</div>;
    });
  } else {
    return <div>Not found</div>;
  }
});

// Change useDBQuery, useDBMutation -> useDB
// mutate API refactor, pass db.Post.create({ data: { id: '1', title: 'this is a post' } }) in mutate function
// Replace refetch to fetch and add filter function

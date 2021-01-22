import { db } from '@usedb/core';
import { useDB } from '@usedb/react';
import { observer } from 'mobx-react-lite';
import * as React from 'react';

export const CreatePost = observer(function CreatePost() {
  const [value, setValue] = React.useState('');
  const { status, setQuery } = useDB();

  const handleCreatePost = e => {
    e.preventDefault();
    setQuery(
      db.Post.create({
        data: { text: value },
      })
    );
  };

  return (
    <div>
      <form onSubmit={handleCreatePost}>
        <input
          type="text"
          onChange={e => setValue(e.target.value)}
          value={value}
        />
        <button type="submit" disabled={status === 'loading'}>
          Create post
        </button>
      </form>
    </div>
  );
});

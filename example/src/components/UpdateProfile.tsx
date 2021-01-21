import { useDB } from '@usedb/react';
import { db } from '@usedb/core';
import * as React from 'react';
import { observer } from 'mobx-react-lite';

export const UpdateProfile = observer(() => {
  const { data: user, error } = useDB(db.User.findOne({ where: { id: 1 } }));
  const { setQuery } = useDB();

  const updateUserName = () => {
    setQuery(
      db.User.update({
        where: { id: 1 },
        data: { username: 'nishan_updated' },
      })
    );
  };

  return (
    <div>
      <h1>Hello {user?.username}</h1>
      <button onClick={updateUserName}>Change username </button>
    </div>
  );
});

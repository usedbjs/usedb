import React from 'react';
import { Connection } from '@usedb/core';

export const UseDBReactContext: any = /*#__PURE__*/ React.createContext(null);

if (process.env.NODE_ENV !== 'production') {
  UseDBReactContext.displayName = 'UseDBReact';
}

export function Provider({
  connection,
  children,
}: {
  connection: Connection;
  children: any;
}) {
  return (
    <UseDBReactContext.Provider value={{ connection }}>
      {children}
    </UseDBReactContext.Provider>
  );
}

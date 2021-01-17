import { QueryData } from '@usedb/core';

const refetchMap = new Map<any, any>();
type ICallback = () => any;

export const refetchCallbacks = {
  set(query: QueryData, val: ICallback) {
    const existing = refetchCallbacks.get(query);
    refetchMap.set(query.queryKey, [...existing, val]);
  },
  get(query: QueryData) {
    return refetchMap.get(query.queryKey) ?? [];
  },
  getAll() {
    return Array.from(refetchMap.values());
  },
  filter(fn: any) {
    return refetchCallbacks.getAll().filter(fn);
  },
  delete(query: QueryData, fn: any) {
    const newArr = this.get(query).filter((f: any) => f !== fn);
    refetchMap.set(query.queryKey, newArr);
  },
};

// Revalidates all the Post.find, Post.findMany queries
// refetch();
// ToDo
// refetch(db.Post.findMany);
// refetch(db.Post);
// refetch(db.Post.findOne({where: {id:2}}));
// refetch(db.Post.findOne);
const refetchQueries = (query: QueryData) => {
  const callbacks = refetchCallbacks.get(query);
  callbacks.forEach((callback: any) => callback());
};

export { refetchQueries };

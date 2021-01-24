import { QueryData } from '@usedb/core';

const refetchMap = new Map<any, any>();
type ICallback = () => any;

const refetchCallbacks = {
  set(query: QueryData, val: ICallback) {
    const existing = this.get(query);
    refetchMap.set(query.queryKey, [...existing, val]);
  },
  get(query: QueryData) {
    return refetchMap.get(query.queryKey) ?? [];
  },
  getAll() {
    return Array.from(refetchMap.values());
  },
  filter(fn: any) {
    return this.getAll().filter(fn);
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
const refetchByQuery = (query: QueryData) => {
  const callbacks = refetchCallbacks.get(query);
  callbacks.forEach((callback: any) => callback());
};

const refetchByQueryKey = (queryKey: string) => {
  const callbacks = refetchMap.get(queryKey) ?? [];
  callbacks.forEach((callback: any) => callback());
};

export { refetchByQuery, refetchCallbacks, refetchByQueryKey };

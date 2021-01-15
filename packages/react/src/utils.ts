const refetchMap = new Map<any, any>();
type ICallback = () => any;

export const refetchCallbacks = {
  set(key: string, val: ICallback) {
    const existing = refetchCallbacks.get(key);
    refetchMap.set(key, [...existing, val]);
  },
  get(key: string) {
    return refetchMap.get(key) ?? [];
  },
  getAll() {
    return Array.from(refetchMap.values());
  },
  filter(fn: any) {
    return refetchCallbacks.getAll().filter(fn);
  },
  delete(key: string, fn: any) {
    const newArr = this.get(key).filter((f: any) => f !== fn);
    refetchMap.set(key, newArr);
  },
};

// Revalidates all the Post.find, Post.findMany queries
// refetch();
// ToDo
// refetch(db.Post.findMany);
// refetch(db.Post);
// refetch(db.Post.findOne({where: {id:2}}));
// refetch(db.Post.findOne);
const refetchQueries = (collectionName: string) => {
  const callbacks = refetchCallbacks.get(collectionName);
  callbacks.forEach((callback: any) => callback());
};

export { refetchQueries };

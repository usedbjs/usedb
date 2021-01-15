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
    return this.getAll().filter(fn);
  },
  delete(key: string, fn: any) {
    const newArr = this.get(key).filter((f: any) => f !== fn);
    this.set(key, newArr);
  },
};

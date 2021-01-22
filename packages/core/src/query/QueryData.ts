export default class QueryData {
  collection: string;
  operation: string;
  payload: any;
  queryKey: string;

  constructor(
    collection: string,
    operation: string,
    payload: any,
    queryKey?: any
  ) {
    this.collection = collection;
    this.operation = operation;
    this.payload = payload;
    this.queryKey = queryKey ?? getHash(this);
  }
}

// Reference from react-query
export const getHash = (val: any) => {
  return JSON.stringify(val, (_, val) =>
    isPlainObject(val)
      ? Object.keys(val)
          .sort()
          .reduce((result, key) => {
            result[key] = val[key];
            return result;
          }, {} as any)
      : val
  );
};

export function isPlainObject(o: any): o is Object {
  if (!hasObjectPrototype(o)) {
    return false;
  }

  // If has modified constructor
  const ctor = o.constructor;
  if (typeof ctor === 'undefined') {
    return true;
  }

  // If has modified prototype
  const prot = ctor.prototype;
  if (!hasObjectPrototype(prot)) {
    return false;
  }

  // If constructor does not have an Object-specific method
  if (!prot.hasOwnProperty('isPrototypeOf')) {
    return false;
  }

  // Most likely a plain Object
  return true;
}

function hasObjectPrototype(o: any): boolean {
  return Object.prototype.toString.call(o) === '[object Object]';
}

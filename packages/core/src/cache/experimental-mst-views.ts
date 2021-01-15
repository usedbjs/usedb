import { filter, isEmpty, pick } from 'lodash';

interface KeyPair {
  [key: string]: any;
}

type CollectionName = string;

type IFindOptions = { where: KeyPair; select?: Array<string> };

export const exerimentalMSTViews = (self: any): any => {
  const toArray = (collection: CollectionName): any => {
    let temp = Array.from(self[collection].values());

    return temp;
  };

  return {
    findOne: (collection: CollectionName, payload: IFindOptions) => {
      let returnValue: any;
      if (payload.hasOwnProperty('where')) {
        let val = filter(toArray(collection), payload.where);
        returnValue = val.length ? val[0] : undefined;
      }
      if (payload.hasOwnProperty('select')) {
        //@ts-ignore
        let queryResult = pick(returnValue, payload.select);
        returnValue = !isEmpty(queryResult) ? queryResult : undefined;
      }

      return returnValue;
    },

    findMany: <T>(
      collection: CollectionName,
      payload: IFindOptions
    ): Array<T> => {
      let returnValue: any = [];

      if (payload.hasOwnProperty('where')) {
        returnValue = filter(toArray(collection), payload.where);
      }

      if (payload.hasOwnProperty('select')) {
        let queryResults: any = [];
        returnValue.forEach((result: any) => {
          //@ts-ignore
          let temp = pick(result, payload.select);
          queryResults.push(temp);
        });
        returnValue = queryResults;
      }

      return returnValue;
    },

    count: (collection: CollectionName, payload: IFindOptions) => {
      let returnValue: any = 0;
      if (payload.hasOwnProperty('where')) {
        let filteredValues = filter(toArray(self[collection]), payload.where);
        returnValue = filteredValues.length;
      }

      return returnValue;
    },
  };
};

import {
  IAnyModelType,
  isReferenceType,
  isArrayType,
  isModelType,
  isLateType,
  isOptionalType,
  isUnionType,
  IAnyType,
} from 'mobx-state-tree';

export function isObject(obj: any) {
  return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
}

export function isPlainObject(obj: any) {
  let proto = obj;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }

  return Object.getPrototypeOf(obj) === proto;
}

export function normalizeResponseGenerator(db: any) {
  function normalizeFromOptionalType(input: any, type: IAnyType) {
    if (!input) {
      //@ts-ignore
      input = type.getDefaultInstanceOrSnapshot();
    }
    //@ts-ignore
    return normalizeFromAnyType(input, type._subtype);
  }

  function normalizeFromArrayType(input: any, type: IAnyType) {
    if (!input) input = [];
    //@ts-ignore
    const subType = type._subType;
    const processedEntity: any = [];
    input.forEach((item: any, index: number) => {
      processedEntity[index] = normalizeFromAnyType(item, subType);
    });
    return processedEntity;
  }

  function normalizeFromReferenceType(input: any, type: IAnyType): any {
    //@ts-ignore
    const realType = type.targetType;
    return normalizeFromAnyType(input, realType);
  }

  function normalizeFromModel(input: any, model: IAnyModelType) {
    if (!input) {
      return;
    }

    if (!isPlainObject(input)) {
      return input;
    }

    const processedEntity: any = {};

    //@ts-ignore
    model.forAllProps((name: any, childType: IAnyType) => {
      if (!isNil(input[name])) {
        processedEntity[name] = normalizeFromAnyType(input[name], childType);
      }
    });

    return {
      ...processedEntity,
      id: getIdentifierValue(processedEntity, model),
      __typename: model.name,
    };
  }

  const getIdentifierValue = (input: any, model: IAnyModelType) => {
    const entityType = model.identifierAttribute || 'id';
    return input[entityType];
  };

  function normalizeFromUnionType(input: any, type: any): any {
    const realType =
      type.determineType(input, undefined) ||
      type._types.find((x: any) => isReferenceType(x));

    return normalizeFromAnyType(input, realType);
  }

  function normalizeFromLateType(input: any, type: IAnyType): any {
    //@ts-ignore
    const realType = type.getSubType();
    return normalizeFromAnyType(input, realType);
  }

  function normalizeFromAnyType(input: any, type: IAnyType): any {
    if (isLateType(type)) {
      return normalizeFromLateType(input, type);
    } else if (isModelType(type)) {
      if (db.isRootType((type as IAnyModelType).name)) {
        return normalizeFromModel(input, type);
      } else {
        const tempResult: any = {};
        //@ts-ignore
        type.forAllProps((name, childType) => {
          if (!isNil(input[name])) {
            let val = normalizeFromAnyType(input[name], childType);
            tempResult[name] = val;
          }
        });
        return tempResult;
      }
    } else if (isUnionType(type)) {
      return normalizeFromUnionType(input, type);
    } else if (isOptionalType(type)) {
      return normalizeFromOptionalType(input, type);
    } else if (isArrayType(type)) {
      return normalizeFromArrayType(input, type);
    } else if (isReferenceType(type)) {
      return normalizeFromReferenceType(input, type);
    } else {
      return input;
    }
  }

  const normalizeResponse = (input: any, model: IAnyModelType) => {
    let res: any = {};

    if (isModelType(model)) {
      if (
        db.isRootType(model.name) &&
        input &&
        model.identifierAttribute &&
        input[model.identifierAttribute] !== undefined
      ) {
        res.id = input[model.identifierAttribute];
        res.__typename = model.name;
      }

      //@ts-ignore
      model.forAllProps((name: string, childType: IAnyType) => {
        if (!isNil(input[name])) {
          res[name] = normalizeFromAnyType(input[name], childType);
        }
      });
    } else {
      res = normalizeFromAnyType(input, model);
    }

    return res;
  };

  const normalizeFromArray = <T>(
    inputs: Array<T>,
    model: Array<IAnyModelType>
  ) => {
    let normalizedRes: Array<T> = [];
    if (!Array.isArray(inputs) || !Array.isArray(model)) {
      throw new TypeError('Expect both input and model to be array types');
    }

    inputs.forEach(input => {
      const normalizedData = normalizeResponse(input, model[0]);
      normalizedRes.push(normalizedData);
    });

    return normalizedRes;
  };

  const normalize = (input: any, model: IAnyModelType) => {
    return Array.isArray(input)
      ? normalizeFromArray(input, [model])
      : normalizeResponse(input, model);
  };

  return normalize;
}

const isNil = (val: any) => {
  return val == null;
};

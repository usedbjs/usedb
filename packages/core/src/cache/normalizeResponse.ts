//@ts-nocheck
import {
  IAnyModelType,
  isReferenceType,
  isArrayType,
  isModelType,
  isLateType,
  isOptionalType,
  isUnionType,
} from 'mobx-state-tree';

export function isObject(obj) {
  return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
}

export function isPlainObject(obj) {
  let proto = obj;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }

  return Object.getPrototypeOf(obj) === proto;
}

const ANONYMOUS_MODEL = 'AnonymousModel';

export function normalizeResponseGenerator(db) {
  function normalizeFromOptionalType(input, type) {
    if (!input) {
      input = type.getDefaultInstanceOrSnapshot();
    }
    return normalizeFromAnyType(input, type._subtype);
  }

  function normalizeFromArrayType(input, type) {
    if (!input) input = [];
    const subType = type._subType;
    const processedEntity: any = [];
    input.forEach((item, index) => {
      processedEntity[index] = normalizeFromAnyType(item, subType);
    });
    return processedEntity;
  }

  function normalizeFromReferenceType(input, type) {
    const realType = type.targetType;
    return normalizeFromAnyType(input, realType);
  }

  function normalizeFromModel(input, model) {
    if (!input) {
      return;
    }

    if (!isPlainObject(input)) {
      return input;
    }

    const processedEntity = {};

    model.forAllProps((name, childType) => {
      if (input[name] !== undefined) {
        processedEntity[name] = normalizeFromAnyType(input[name], childType);
      }
    });
    return {
      ...processedEntity,
      id: getIdentifierValue(processedEntity, model),
      __typename: model.name,
    };
  }

  const getIdentifierValue = (input, model) => {
    const entityType = model.identifierAttribute || 'id';
    return input[entityType];
  };

  function normalizeFromUnionType(input, type) {
    const realType =
      type.determineType(input, undefined) ||
      type._types.find(x => isReferenceType(x));

    return normalizeFromAnyType(input, realType);
  }

  function normalizeFromLateType(input, type) {
    const realType = type.getSubType();
    return normalizeFromAnyType(input, realType);
  }

  function normalizeFromAnyType(input, type) {
    if (isLateType(type)) {
      return normalizeFromLateType(input, type);
    } else if (isModelType(type)) {
      if (db.isRootType(type.name)) {
        return normalizeFromModel(input, type);
      } else {
        const tempResult = {};
        //@ts-ignore
        type.forAllProps((name, childType) => {
          if (input[name] !== undefined) {
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
    let res = {};
    if (isModelType(model)) {
      if (db.isRootType(model.name)) {
        res.id = input[model.identifierAttribute];
        res.__typename = model.name;
      }

      model.forAllProps((name, childType) => {
        if (input[name] !== undefined) {
          res[name] = normalizeFromAnyType(input[name], childType);
        }
      });
    } else {
      res = normalizeFromAnyType(input, model);
    }

    return res;
  };

  const normalizeFromArray = (inputs, model) => {
    let normalizedRes = [];
    if (!Array.isArray(inputs) || !Array.isArray(model)) {
      throw new TypeError('Expect both input and model to be array types');
    }

    inputs.forEach(input => {
      const normalizedData = normalizeResponse(input, model[0]);
      normalizedRes.push(normalizedData);
    });

    return normalizedRes;
  };

  const normalize = (input, model) => {
    return Array.isArray(input)
      ? normalizeFromArray(input, [model])
      : normalizeResponse(input, model);
  };

  return normalize;
}

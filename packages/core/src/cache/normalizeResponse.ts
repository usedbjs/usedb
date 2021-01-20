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
    processedEntity[name] = normalizeFromAnyType(input[name], childType);
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
    if (type.name.indexOf(ANONYMOUS_MODEL) >= 0) {
      const tempResult = {};
      //@ts-ignore
      type.forAllProps((name, childType) => {
        let val = normalizeFromAnyType(input[name], childType);
        tempResult[name] = val;
      });
      return tempResult;
    }

    return normalizeFromModel(input, type);
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

export const normalizeResponse = (input: any, model: IAnyModelType) => {
  let res = {};
  //@ts-ignore
  model.forAllProps((name, childType) => {
    res[name] = normalizeFromAnyType(input[name], childType);
  });
  return res;
};

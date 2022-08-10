// @ts-nocheck
const hardTypes = require("./scripts/types");

const easyTypes = {};

Object.keys(hardTypes.types).forEach((typeName) => {
  const fields = hardTypes.types[typeName];
  easyTypes[typeName] = {};
  fields.forEach((field) => {
    easyTypes[typeName][field.name] = field.type;
  });
});

export default easyTypes;

import { QueryParameters } from '../models/DirectusModel';

const concatenateQueryParameters = (props: QueryParameters) => {
  let allParams = '';
  for (const [key, value] of Object.entries(props)) {
    if (value) {
      typeof value === 'string' || typeof value === 'number'
        ? (allParams += `${key}=${value}&`)
        : (allParams += `${key}=${JSON.stringify(value)}&`);
    }
  }
  return allParams;
};

export default concatenateQueryParameters;

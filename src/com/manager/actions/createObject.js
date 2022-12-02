import lo from 'lodash';
import cuid from 'cuid';
import { v4 as uuid } from 'uuid';

export default async function createObject({input, doc, path, values}){
  let payload = JSON.parse(values.data);
  console.log(payload);
  return payload;
};

export function validateData(input){
  const errors = [];
  let data = null;
  try{data = JSON.parse(input)}
  catch(e){errors.push('Well formed JSON input is required.')}
  if(!lo.isObject( data )) errors.push('Object-like JSON input required');
  return { errors, error: lo.first( errors ), valid: errors.length == 0 }
}

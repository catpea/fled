import lo from 'lodash';
import cuid from 'cuid';
import { v4 as uuid } from 'uuid';

export default async function declareProperty({input, doc, path, values}){

  let target = lo.cloneDeep(input||doc||{});


  let payload = values.data;

  if(values.type === 'undefined'){
    payload = undefined;
  }else if(values.type === 'string'){
    payload =  values.data + '';
  }else if(values.type === 'number'){
    payload =  values.data + 0;
  }else if(values.type === 'object'){
    payload = JSON.parse(values.data);
  }else if(values.type === 'array'){
    payload = JSON.parse(values.data);
  }else{
    payload = '';
  }

  const location = [...path, ...values.name.split('.').filter(i=>i)];
  console.log('location', location);
  if(payload === undefined){
    target = lo.omit(target, [location])
  }else{
    lo.set(target, location, payload);
  }

  console.log(target);

  return target;

};


 const validation = {


   validName: {
     exists: {
       test: (input)=>!!input,
       message:'enter a valid property name or path'
     },
     startWithLetter: {
       test: (input)=>input.match(/^[a-zA-Z]/)!==null,
       message:'must start with a letter'
     },
     alphaNumeric: {
       test: (input)=>input.match(/^[A-Za-z0-9_.]+$/)!==null,
       message:'must be alphanumeric and _ can include a . for nested operations'
     },
   }

 }

export function validateName(input){
  const errors = Object.entries(validation.validName).filter(([key, val])=>!val.test(input)).map(([,val])=>val.message);
  return { errors, error: lo.first( errors ), valid: errors.length == 0 }
}

export function validateData(input, type){
  const errors = [];

  if(type === 'string'){
    if(!lo.isString(input)) errors.push('string input required');
  }else if(type === 'number'){
    try{if(!lo.isNumber(JSON.parse(input))) errors.push('numeric input required')}
    catch(e){errors.push('valid numeric input required')}
  }else if(type === 'object'){
    let data = null;
    try{data = JSON.parse(input)}
    catch(e){errors.push('JSON input required')}
    if(!lo.isObject( data )) errors.push('Object-like JSON input required');

  }else if(type === 'array'){
    let data = null;
    try{data = JSON.parse(input)}
    catch(e){errors.push('JSON input required')}
    if(!lo.isArray( data )) errors.push('Array-like JSON input required');

  }

  return { errors, error: lo.first( errors ), valid: errors.length == 0 }
}

import lo from 'lodash';
import cuid from 'cuid';
import { v4 as uuid } from 'uuid';

export default async function declareDocument({input, doc, path, values}){

  console.log('INPUT!!!', input);
  console.log('values!!!', values);

  const document = {
    _id: values.id,
    title: values.title,
  };


  return document;

};
 
 const validation = {
   validTitle: {
     exists: {
       test: (input)=>!!input,
       message:'enter a name'
     },
     longEnough: {
       test: (input)=>input.length >= 2,
       message:'name is too short'
     },
   },

   validId: {
     exists: {
       test: (input)=>!!input,
       message:'enter a valid id'
     },
     lowerCase: {
       test: (input)=>input.match(/[A-Z]+/)===null,
       message:'cannot contain uppercase letters'
     },
     startWithLetter: {
       test: (input)=>input.match(/^[a-z]/)!==null,
       message:'must start with lowercase letter'
     },
     alphaNumeric: {
       test: (input)=>input.match(/^[a-z0-9_-]+$/)!==null,
       message:'must be alphanumeric and _ only'
     },
     longEnough: {
       test: (input)=>input.length >= 4,
       message:'id is too short'
     },
   }
 }

export function validateTitle(input){
  const errors = Object.entries(validation.validTitle).filter(([key, val])=>!val.test(input)).map(([,val])=>val.message);
  return { errors, error: lo.first( errors ), valid: errors.length == 0 }
}
export function validateId(input){
  const errors = Object.entries(validation.validId).filter(([key, val])=>!val.test(input)).map(([,val])=>val.message);
  return { errors, error: lo.first( errors ), valid: errors.length == 0 }
}

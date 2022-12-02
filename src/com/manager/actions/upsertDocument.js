import lo from 'lodash';
import { db } from '../store.js';

export default async function upsertDocument({input, doc, path, values}){

  // simple save protocol
  let existing = {}; // prepare for download of existing version
  try { existing = await db.get(input._id) } catch(e) { console.info(e) } // download existing

  console.log(existing);

  const merged = Object.assign({}, existing, input);
  const picked = lo.pick(merged, Object.keys(input))
  await db.put(picked); // layer changes over existing and save

};

import { readable } from 'svelte/store';
import {db} from './database.js';

// export const designDocuments = readable([], set => {
// 	db.designDocuments().then(o=>set(o));
//
//   changes.on('change', async change => {
// 		if(change.id.startsWith('_design/')){
// 			const ddocs = await db.designDocuments();
// 			set(ddocs);
// 		}
// 	});
//
// 	return ()=>changes.cancel();
// });


/*
import { designDocuments } from '/src/lib/design-documents.js';
<h1>{$designDocuments}</h1>
*/


export function updatable(_id){
	if(!_id) return readable(null);

  return readable(null, set => {
  	db.get(_id).then(doc=>set(doc));
    const changes = db.changes({ since: 'now', live: true, include_docs: true, });
    changes.on('change', async ({id, doc}) => {if(id == _id) set(doc)} );
  	return () => {
      // cleanup
      changes.cancel();
    }
  });

}

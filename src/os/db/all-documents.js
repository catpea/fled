import {readable} from 'svelte/store';

export function allDocuments(db){

	return readable([], set => {

		db.allDocs({include_docs: true}).then(o=>set(o.rows));

	  const changes = db.changes({ since: 'now', live: true });

	  changes.on('change', async (data)=>{

			db.allDocs({include_docs: true}).then(o=>set(o.rows));

		});

		return ()=>changes.cancel();

	});

}

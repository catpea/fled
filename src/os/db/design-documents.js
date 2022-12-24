import {readable} from 'svelte/store';

export function designDocuments(db){

	return readable([], set => {

		db.designDocuments().then(o=>set(o));

	  const changes = db.changes({ since: 'now', live: true });

	  changes.on('change', async change => {
			if(change.id.startsWith('_design/')){
				const ddocs = await db.designDocuments();
				set(ddocs);
			}
		});

		return ()=>changes.cancel();

	});

}

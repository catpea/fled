import { writable } from 'svelte/store';

function collection({db, design, view, key}) {



    //if(changes) changes.cancel();
    console.log(`installing change monitor: ${design}/${view}:${key}`);

     changes = db.changes({
       filter: '_view',
       view: `${design}/${view}`,
       // --- //
       since: 'now',
       live: true,
       include_docs:true
     });

    changes.off('change', monitor);
    changes.on('change', monitor);
    // const docs = await db.query(`${design}/${view}`, { dkey });
    rows = docs.rows;



  async function monitor (change) {
    console.log(`++: change detected ${design}/${view}:${key}`);
    const docs = await db.query(`${design}/${view}`, { key });
    set(docs.rows)
  }

}


class Collection {

  constructor({db, design, view, key}){

    const { subscribe:storeSubscribe, set:storeSet, update:storeUpdate } = writable([]);

    this.storeUnsubscribe = null;
    this.dbChanges = null;

    this.db = db;

    this.storeSubscribe = storeSubscribe;
    this.storeSet = storeSet;
    this.storeUpdate = storeUpdate;

    this.design = design;
    this.view = view;
    this.key = key;

    this.dbChanges = this.db.changes({
      filter: '_view',
      view: [design, view].join('/'),
      // --- //
      since: 'now',
      live: true,
      include_docs:true
    });

    this.dbChanges.on('change', this.dbChange.bind(this));
    this.dbChange({}); // kick off
  }

  async dbChange(change){
    console.log(`++: change detected...${this.design}/${this.view}`);
    const docs = await this.db.query(`${this.design}/${this.view}`, { key: this.key });
    this.storeSet(docs.rows);
  }

  subscribe(...a){
    console.log('Subscribe', this);
    this.storeUnsubscribe = this.storeSubscribe(...a);
    return this.unsubscribe.bind(this);
  }

  unsubscribe(){
    console.log('Unsubscribe', this);
    if(this.storeUnsubscribe) this.storeUnsubscribe();
    this.dbChanges.off('change', this.dbChange.bind(this));
    this.dbChanges.cancel();
  }



}














export default Collection; //({db, design, view, key});

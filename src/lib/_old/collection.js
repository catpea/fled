import { writable } from 'svelte/store';

class Collection {

  constructor({db, design, view, key, include_docs=false, changed:changedCallback}){

    const { subscribe:storeSubscribe, set:storeSet, update:storeUpdate } = writable([]);

    this.storeUnsubscribe = null;
    this.dbChanges = null;

    this.db = db;
    this.changedCallback = changedCallback;

    this.storeSubscribe = storeSubscribe;
    this.storeSet = storeSet;
    this.storeUpdate = storeUpdate;

    this.include_docs = include_docs;
    this.design = design;
    this.view = view;
    this.key = key;

    if(this.db && this.design && this.view){
      this.dbChanges = this.db.changes({
        filter: '_view',
        view: [this.design, this.view].join('/'),
        // --- //
        since: 'now',
        live: true,
        include_docs: this.include_docs
      });
      this.boundDbChange = this.dbChange.bind(this); // this.thing dows not work in dbChange so it is set here.
      this.dbChanges.on('change', this.boundDbChange );
      console.log(`src/lib/collection.js kickoff for ${this.design}/${this.view}`);
      this.dbChange({}); // kick off
    }

  }

  async dbChange(change){
    console.log(`++: change detected...${this.design}/${this.view}`);
    const docs = await this.db.query(`${this.design}/${this.view}`, { key: this.key, include_docs: this.include_docs });
    await this.storeSet(docs.rows);
    if(this.changedCallback) this.changedCallback(docs.rows)
  }

  subscribe(...a){
    console.log('Subscribe', this);
    this.storeUnsubscribe = this.storeSubscribe(...a);
    return this.unsubscribe.bind(this);
  }

  unsubscribe(){
    console.log('Unsubscribe', this);
    if(this.storeUnsubscribe) this.storeUnsubscribe();
    if(this.dbChanges) this.dbChanges.cancel();
  }



}














export default Collection; //({db, design, view, key});

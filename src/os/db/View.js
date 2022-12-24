import lo from 'lodash';
import {Document} from './Document.js';

export class View {
  #db;
  #design;
  #view;
  #key;
  #value;

  #prefix = '_design';
  #sep = '/';

  #subscribers = [];
  #designDocumentChanges;
  #viewResultChanges;

  constructor ({db, design, view, key}){

    this.#db = db;
    this.#design = design;
    this.#view = view;
    this.#key = key;

    this.#value = [];
  }

  // SVELTE
  // A store must contain a .subscribe method, which must accept as its argument a subscription function.
  subscribe(subscriptionFunction){

    // This subscription function must be immediately and synchronously called with the store's current value upon calling .subscribe
    subscriptionFunction(this.#value);

    // All of a store's active subscription functions must later be synchronously called whenever the store's value changes.
    const isFirstSubscription = this.#subscribers.length==0;
    if(isFirstSubscription) this.connect(); // connect will be called when the number of subscribers goes from zero to one (but not from one to two, etc).
    this.#subscribers.push(subscriptionFunction);

    //The .subscribe method must return an unsubscribe function.
    // Calling an unsubscribe function must stop its subscription,
    // and its corresponding subscription function must not be called again by the store.
    return ()=>{
      this.#subscribers.splice(this.#subscribers.indexOf(subscriptionFunction), 1);
      const isLastSubscription = this.#subscribers.length==0;
      if(isLastSubscription) this.disconnect();
    };
  }

  #pause; // bool
  #paused = null; // data
  get pause() {
    return this.#pause;
  }
  set pause(value) {
    // if(this.#key === value) return; // nothing to do.
    if(!value){
      // uncork
      this.set(this.#paused);
      this.#paused = null;
    }
    this.#pause = value;
    // this.reconnect()
  }


  // SVELTE
  set(value){
    // A store may optionally contain a .set method,
    /// which must accept as its argument a new value for the store,
    // and which synchronously calls all of the store's active subscription functions. Such a store is called a writable store.

    if(value === null) return;

    // undo listeners
    this.#value
    .filter(o=>o)
    .filter(o=>o.disconnect)
    .map(o=>{
      console.log(o);
      o.disconnect();
    });

    if(this.#pause){
      this.#paused = value;
    }else{
      this.#value = value;
    }

    // apply listeners
    this.#value.map(o=>new Document(this.#db, o._id));

    this.#subscribers.map(subscriber=>subscriber(this.#value))
  }

  // SVELTE
  //update is a method that takes one argument which is a callback.
  update(callback){
    // The callback takes the existing store value as its argument
    // and returns the new value to be set to the store.
    this.set(callback(this.#value));
  }

  //#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$

  get key() {
    return this.#key;
  }

  set key(value) {
    if(this.#key === value) return; // nothing to do.
    this.#key = value;
    this.reconnect()
  }

  //#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$

  // POUCHDB
  reconnect(){
    this.disconnect();
    this.connect();
  }

  // POUCHDB
  connect(){

      // monitor for changes to the design document it self.
      const doc_ids = [ [this.#prefix, this.#design].join(this.#sep) ];
      this.#designDocumentChanges = this.#db.changes({
        doc_ids, // changes to design document
        // --- //
        since: 'now',
        live: true,
        include_docs: true
      });
      // monitor for changes to the collection
      this.#viewResultChanges = this.#db.changes({
        filter: '_view',
        view: [this.#design, this.#view].join(this.#sep),
        since: 'now',
        live: true,
        include_docs: true
      });

      this.#designDocumentChanges.on('change', (data)=>{
        this.reconnect()
      });

      this.#viewResultChanges.on('change', (data)=>{
        this.#db.query( [this.#design, this.#view].join(this.#sep), { key: this.#key, include_docs: true }).then((data)=>{
          this.set( data.rows.map(row=>row.doc) );
        });
      });

      // db.query will produce data.rows
      this.#db.query([this.#design, this.#view].join(this.#sep), { key: this.#key, include_docs: true }).then((data)=>{
        this.set( data.rows.map(row=>row.doc) );
      });

  }

  // POUCHDB
  disconnect(){
    this.#designDocumentChanges.cancel();
    this.#viewResultChanges.cancel();
  }

}

  import lo from 'lodash';

export class View {
  api = `2.0.0`;

  id;
  options;
  value;

  #subscribers = [];
  #designDocumentChanges;
  #viewResultChanges;

  constructor (db, id, options = {}){
    this.db = db;
    this.id = id;
    this.options = options;
    this.value = null;
  }


  // A store must contain a .subscribe method, which must accept as its argument a subscription function.
  subscribe(subscriptionFunction){

    // This subscription function must be immediately and synchronously called with the store's current value upon calling .subscribe
    subscriptionFunction(this.value);

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

  set(value){
    // A store may optionally contain a .set method,
    /// which must accept as its argument a new value for the store,
    // and which synchronously calls all of the store's active subscription functions. Such a store is called a writable store.
    this.value = value;
    // console.log('View.js: NEW VALUE', this.value);
    this.#subscribers.map(subscriber=>subscriber(this.value))
  }

  //update is a method that takes one argument which is a callback.
  update(callback){
    // The callback takes the existing store value as its argument
    // and returns the new value to be set to the store.
    this.set(callback(this.value));
  }




  refresh(){
    console.log('view is refreshing...');
    this.disconnect();
    this.connect();
  }

  connect(){

      // monitor for changes to the design document it self.
      let xxx = lo.take(this.id.split('/'),2).join('/');
      // console.log('designDocumentChanges listening to: ', xxx);

      this.#designDocumentChanges = this.db.changes({
        doc_ids: [  xxx ], // changes to design document
        // --- //
        since: 'now',
        live: true,
        include_docs: true
      });


      // monitor for changes to the collection
      this.#viewResultChanges = this.db.changes({
        filter: '_view',
        view: this.id.startsWith('_design/')?this.id.substr(8):this.id,
        // --- //
        since: 'now',
        live: true,
        include_docs: true
      });


      this.#designDocumentChanges.on('change', (data)=>{
        // console.log(`designDocumentChanges this.#changes.on('change', (data)=>`, data);
        // console.log('XXXXXXXXXXXXXXXXX: this.#designDocumentChanges!!!!!!');
        this.refresh()
      });

      this.#viewResultChanges.on('change', (data)=>{
        // console.log('XXXXXXXXXXXXXXXXX: this.#viewResultChanges!!!!!!', this.id, this.options.key);
        this.db.query(this.id.startsWith('_design/')?this.id.substr(8):this.id, { key: this.options.key, include_docs: true }).then((data)=>{
          this.set( data.rows.map(row=>row.doc) );
        });
      });



      // this.#changes.on('change', (data)=>{
      //   console.log(`View.js: ${this.id} view changes detected`, data);
      //   this.refresh()
      //   // // find which index in the values array has changed
      //   // const changedIndex = this.value.findIndex(doc=>doc._id == data.doc._id);
      //   // // assign and notify
      //   // this.value[changedIndex] = data.doc;
      //   // this.set(this.value);
      //
      //   // // db.query will produce data.rows
      //   // this.db.query(this.id, { key: this.options.key, include_docs: true }).then((data)=>{
      //   //   // console.log(`this.#changes.on('change', (data)=>`, data);
      //   //   this.set( data.rows.map(row=>row.doc) );
      //   // });
      //
      // });


      // db.query will produce data.rows
      this.db.query(this.id.startsWith('_design/')?this.id.substr(8):this.id, { key: this.options.key, include_docs: true }).then((data)=>{
        // console.log(`this.#changes.on('change', (data)=>`, data);
        this.set( data.rows.map(row=>row.doc) );
      });

  }

  disconnect(){
    this.#designDocumentChanges.cancel();
    this.#viewResultChanges.cancel();
  }


}

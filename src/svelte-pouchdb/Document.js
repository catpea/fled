export class Document {

  _id;
  options;
  value;
  debug;

    constructor (db, id, options = {}){
      this.debug = options.debug;
      this.db = db;
      this._id = id;
      this.options = options;
      this.value = {};
      // console.log('ccCCCCCCCCC', this.debug);
    }



  #subscribers = [];

  // A store must contain a .subscribe method, which must accept as its argument a subscription function.

  subscribe(subscriptionFunction){

    // This subscription function must be immediately and synchronously called with the store's current value upon calling .subscribe
    subscriptionFunction(this.value);

    // All of a store's active subscription functions must later be synchronously called whenever the store's value changes.

    const isFirstSubscription = this.#subscribers.length==0;
    if(isFirstSubscription) this.connect(); // connect will be called when the number of subscribers goes from zero to one (but not from one to two, etc).
    this.#subscribers.push(subscriptionFunction);
    //console.log('Document Listener Subscribed');

    this.log(`_id:${this._id}: new subscriber, there are now a total of ${this.#subscribers.length} subscribers.`);

    //The .subscribe method must return an unsubscribe function.
    // Calling an unsubscribe function must stop its subscription,
    // and its corresponding subscription function must not be called again by the store.
    return ()=>{
      //console.log('Document Listener Unsubscribed');
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
    this.#subscribers.map(subscriber=>subscriber(this.value))
  }

  //update is a method that takes one argument which is a callback.
  update(callback){
    // The callback takes the existing store value as its argument
    // and returns the new value to be set to the store.
    this.set(callback(this.value));
  }



  #changes;

  reconnect(){
    this.log(`_id:${this._id}: reconnecting to _id: ${this._id}`);
    this.disconnect();
    this.connect();
  }


  get id() {
    return this._id;
  }

  set id(value) {
    if(this._id === value) return; // nothing to do.
    this.log(`_id:${this._id}: setting new id (${value}) and reconnecting`);
    this._id = value;
    this.reconnect()
  }

  connect(){
      if(!this._id) return this.set({})
      this.log(`_id:${this._id}: connecting...`);
      const doc_ids =[this._id];
      this.log(`_id:${this._id}: listening to doc_ids: ${JSON.stringify(doc_ids)}`);
      this.#changes = this.db.changes({
        doc_ids,
        // --- //
        since: 'now',
        live: true,
        include_docs: true
      });

      this.#changes.on('change', (data)=>{
        this.set(data.doc);
        this.log(`_id:${this._id}: document changed! (Document.js)`);
      });

      this.log(`_id:${this._id}: ${this._id} is listening for changes...`);

      this.db.get(this._id).then((doc)=>{
        this.set(doc);
        this.log(`_id:${this._id}: initial data has been set`);
      });
  }

  disconnect(){
    this.log(`_id:${this._id}: disconnected`);
    if(this.#changes) this.#changes.cancel();
  }

  #log = []; // holds messages
  log(msg){
    if(!this.debug) return;
    this.#log.push(msg);
    //console.log(msg);
    this.#spies.map(spy=>spy({msg, log:this.#log}))
  }

  #spies = []; // holds spies that listen to mesages
  spy(sub){
    this.#spies.push(sub);
    return () => this.#spies.splice(this.#spies.indexOf(sub), 1);
  }



}

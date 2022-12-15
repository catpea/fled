import lo from 'lodash';
import { v4 as guid } from 'uuid';
import EventEmitter from 'events';

export class Database extends EventEmitter {
  #db;
  constructor(db){
    super()
    this.#db = Object.assign({designs:{}, documents:{}, views:{}, revisions:[], tables:{} }, db);
  }
  put(data){
    if(!data.id) data.id = 'guid-'+guid();
    if(!this.#db.documents[data.id]) this.#db.documents[data.id] = {};
    //TODO: verify data has changed;
    const doc = Object.assign(this.#db.documents[data.id], data);
    this.#updateTables(data.id);
    this.emit('change.doc', {doc});
    this.emit(`change.${doc.id}`, {doc});
    return data.id;
  }
  patch(id, delta){
    if(!id) throw new Error('Patching requires an id');
    const doc = Object.assign(this.#db.documents[id], delta);
    //TODO: verify data has changed;
    this.#updateTables(id);
    this.emit('change.doc', {doc});
    this.emit(`change.${doc.id}`, {doc});
  }
  get(id){
     return this.#db.documents[id];
  }

  view(name, viewBy){
    this.#db.designs[name] = viewBy;
    this.#createTables();
    this.#updateTables();
  }

  #createTables(){
    for (const [designName, mapFunctions] of Object.entries( this.#db.designs )  ) {
      if(!this.#db.tables[designName]) this.#db.tables[designName] = {};
      for (const [viewName, mapFunction] of Object.entries( mapFunctions )  ) {
        if(!this.#db.tables[designName][viewName]) this.#db.tables[designName][viewName] = new Map();
      }
    }
  }

  #updateTables(id){
    let documents;

    if(id){
      documents = [[id,this.#db.documents[id]]];
    }else{
      documents = Object.entries(this.#db.documents);
    }

    // console.log('updateTables', documents);

    for (const [designName, mapFunctions] of Object.entries( this.#db.designs )  ) {
      for (const [viewName, mapFunction] of Object.entries( mapFunctions )  ) {

        for (const [id, doc] of documents) {
          const row = mapFunction(doc);
          // console.log(designName, viewName, mapFunction, row);
          const failed = row===undefined||row.some(key=>key===undefined);
          const existed = this.#db.tables[designName][viewName].has(id);
          // if([designName, viewName].join('-')=='ports-window'){
          //   console.log(failed, existed, row);
          // }
          if(failed){ // selection criteria
            if(existed){ // remove
              this.#db.tables[designName][viewName].delete(id);
              this.emit('change.table', {id, type:'delete', design:designName, view:viewName, row});
            }else{
              this.emit('change.table', {id, type:'noop', design:designName, view:viewName, row});
            }
          }else{ // didn't fail
            const different = !lo.isEqual(this.#db.tables[designName][viewName].get(id), row);
            if(existed){ // mapFunction did not fail, and the value is already here, check for changes
                if(different){ // replace the value
                  this.#db.tables[designName][viewName].set(id, row);
                  this.emit('change.table', {id, type:'patch', design:designName, view:viewName, row});
                }else{
                  this.emit('change.table', {id, type:'noop', design:designName, view:viewName, row});
                }
            }else{ // add
              this.#db.tables[designName][viewName].set(id, row);
              this.emit('change.table', {id, type:'put', design:designName, view:viewName, row});
            }
          }
        } // each doc
      }
    }
  }

  *scan(view, query){
    for (const [id, doc] of Object.entries(this.#db.documents)) {
      if(this.#db.views[view].filter(doc, query)) yield doc;
    }
  }

  *query([designName,viewName], options){

    for (const [id, row] of this.#db.tables[designName][viewName].entries()) {
      // delete \
      // patch   ---
      // put   /
      if(options.key){
        if(lo.isEqual(row, options.key)) yield this.#db.documents[id];
      }else{
        yield this.#db.documents[id];
      }

    }
  }

  listen([designName, viewName], options, execute, initialize){


    const handler = function(event){
      if( event.design==designName && event.view==viewName){
        if(options.key){
          if(lo.isEqual(event.row, options.key)) execute(event)
        }else{
          execute(event);
        }
      }
    }

    this.on('change.table', handler);

    if(initialize){
      initialize({docs:[...this.query([designName, viewName], options)]});
    }

    return ()=>this.off('change.table', handler);
  }

}

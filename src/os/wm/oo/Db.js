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
    let documents = Object.entries(this.#db.documents);
    if(id) documents = [[id,this.#db.documents[id]]];
    for (const [designName, mapFunctions] of Object.entries( this.#db.designs )  ) {
      for (const [viewName, mapFunction] of Object.entries( mapFunctions )  ) {
        for (const [id, doc] of documents) {
          const row = mapFunction(doc);
          const failed = row.some(key=>key===undefined);
          const existed = this.#db.tables[designName][viewName].has(id);
          if(failed){ // selection criteria
            if(existed){ // remove
              this.#db.tables[designName][viewName].delete(id);
              this.emit('change.table', {id, type:'delete', design:designName, view:viewName, row});
            }
          }else{ // didn't fail
            const different = !lo.isEqual(this.#db.tables[designName][viewName].get(id), row);
            if(existed){ // mapFunction did not fail, and the value is already here, check for changes
                if(different){ // replace the value
                  this.#db.tables[designName][viewName].set(id, row);
                  this.emit('change.table', {id, type:'patch', design:designName, view:viewName, row});
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
      if(lo.isEqual(row, options.key)) yield this.#db.documents[id];
    }
  }

  listen([designName,viewName], options, execute){
    const handler = function(event){if(lo.isEqual(event.row, options.key)) execute(event)}
    this.on('change.table', handler)
    return ()=>this.off('change.table', handler);
  }

}

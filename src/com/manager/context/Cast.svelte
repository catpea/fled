<script>

import lo from 'lodash';
import dot from 'dot-object';
import { db, document, location, selection } from '../store.js';


async function convert({id, format, path}){
  const doc = await db.get(id);
  const value = lo.get(doc, path);

  if(format == 'String'){
    lo.set(doc, path, String(value))
  } else if(format == 'Number'){
    lo.set(doc, path, Number(value))
  } else if(format == 'Boolean'){

    lo.set(doc, path, Boolean(value?true:false))
  } else if(format == 'Object'){
    lo.set(doc, path, {value})
  }

  await db.put( doc );
}

</script>


  <div class="card mb-3">
    <div class="card-body">
      <h5 class="card-title">Format {lo.startCase(typeof lo.last($selection))}</h5>
      <form>


        <div class="mb-3">
          <label class="form-label d-block">Convert to:</label>
          <button type="button" class="btn btn-sm btn-link p-0 m-0" title="To String" on:click={()=>convert({ id: $document._id, format:'String' , path: $selection, })}>String</button>
          <button type="button" class="btn btn-sm btn-link p-0 m-0" title="To Number" on:click={()=>convert({ id: $document._id, format:'Number' , path: $selection, })}>Number</button>
          <button type="button" class="btn btn-sm btn-link p-0 m-0" title="To Boolean" on:click={()=>convert({ id: $document._id, format:'Boolean' , path: $selection, })}>Boolean</button>
          <button type="button" class="btn btn-sm btn-link p-0 m-0" title="To Object" on:click={()=>convert({ id: $document._id, format:'Object' , path: $selection, })}>Object</button>
        </div>


      </form>
    </div>
  </div>

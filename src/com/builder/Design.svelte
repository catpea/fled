<script>

  import lo from 'lodash';
  import Pane from '/src/com/Pane.svelte';
  import Source from '/src/com/Source.svelte';

  // shared data
  import { document, design, view, cursor } from './store.js';
  import { drag, drop } from '/src/lib/drag-drop-design.js';

</script>

<div class="mb-3 clearfix">


<div class="btn-group btn-group-sm">
  <button type="button" class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
    State
  </button>
  <ul class="dropdown-menu dropdown-menu-dark shadow">
    <li><a class="dropdown-item" href="#">Loading</a></li>
    <li><a class="dropdown-item" href="#">Exiting</a></li>
    <li><a class="dropdown-item" href="#">Receiving</a></li>
    <li><hr class="dropdown-divider"></li>
    <li><a class="dropdown-item" href="#">Default</a></li>
  </ul>
</div>


  <div class="btn-group btn-group-sm float-end" role="group" aria-label="First group">
    <button type="button" class="btn btn-secondary">Preview</button>
    <button type="button" class="btn btn-secondary" on:click={async ()=>{}}>State</button>
    <button type="button" class="btn btn-secondary" on:click={async ()=>{}}>Events</button>
    <button type="button" class="btn btn-secondary active" on:click={async ()=>{}}>Layout</button>
    <button type="button" class="btn btn-secondary" on:click={async ()=>{}}>Design</button>
  </div>

</div>

<div class="card text-bg-dark rounded shadow p-1 mb-3" style="min-height: 30rem;">

<div class="container text-center p-3 mb-3">
  <div class="row p-3">


    <div class="col p-3" use:drop={{type:'container'}}>
      Column

      <div class="mb-3" use:drag>
        <label for="exampleFormControlInput1" class="form-label">Email address</label>
        <input type="email" class="form-control" id="exampleFormControlInput1" placeholder="name@example.com">
      </div>


    </div>

    <div class="col p-3" use:drop={{type:'container'}}>
      Column

      <div class="mb-3" use:drag>
        <label for="exampleFormControlInput1" class="form-label">Email address</label>
        <input type="email" class="form-control" id="exampleFormControlInput1" placeholder="name@example.com">
      </div>

      <div class="mb-3" use:drag>
        <label for="exampleFormControlTextarea1" class="form-label">Example textarea</label>
        <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
      </div>

    </div>

    <div class="col p-3">
      Column
    </div>
  </div>
</div>

<div class="container text-center p-3 mb-3">
  <div class="row p-3">
    <div class="col p-3">
    <div class="input-group">
      <span class="input-group-text text-bg-dark">With textarea</span>
      <textarea class="form-control" aria-label="With textarea"></textarea>
    </div>
    </div>
    <div class="col p-3">
      Column
    </div>
  </div>
</div>

<div class="container text-center p-3 mb-3">
  <div class="row p-3">
    <div class="col p-3">
      Column
    </div>
    <div class="col py-3 text-end">
    <button type="button" class="btn btn-info">Help</button>
    <button type="button" class="btn btn-danger me-5">Cancel</button>
    <button type="button" class="btn btn-warning">Save</button>

    </div>
  </div>
</div>

</div>

<div class="card text-bg-dark rounded shadow p-1" style="min-height: 10rem;">
  <div class="card-body">
    <h5 class="card-title">Document Data</h5>
    <p class="card-text">To convert documnt data to a useful user interface, you must apply a template.</p>
  </div>

  <Source value={$document}/>

  <pre>
  <code>
  <pre>
Private Sub btnSubmit_Click()
  MsgBox ("Hello World")
End Sub

Private Sub Form_Load()
  Me.Caption = "Finance"
  Me.BackColor = RGB(255, 120, 0)
End Sub
  </code>
  </pre>
</div>

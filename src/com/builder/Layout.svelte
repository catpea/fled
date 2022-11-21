<div class="container-xxl">

  <div class="row">
     <div class="col">
       <slot name="header"></slot>
     </div>
  </div>

  <div class="row">
     <div class="col-3">
       <slot name="menu"></slot>
     </div>
     <div class="col-7">
       <div class="row mb-3"><div class="col"><slot name="body"></slot></div></div>
       <div class="row"><div class="col"><slot name="editor"></slot></div></div>
     </div>
     <div class="col-2">
       <div class="row mb-3"><div class="col"><slot name="toolbox"></slot></div></div>
       <div class="row mb-3"><div class="col"><slot name="properties"></slot></div></div>
     </div>
  </div>

</div>

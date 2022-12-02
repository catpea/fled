<div class="container-fluid">

<div class="row">
  <div class="col">
     <slot name="header"/>
  </div>
</div>

<div class="row">

  <div class="col-12 col-lg-12 col-xl-3">
    <slot name="creator"/>
    <slot name="locations"/>
  </div>

  <div class="col-12 col-lg-9 col-xl-6">
    <div class="row mb-3"><div class="col"><slot name="body"/></div></div>
    <div class="row"><div class="col"><slot name="editor"/></div></div>
  </div>

  <div class="col-12 col-lg-3 col-xl-3">
    <slot name="actions"/>
    <slot name="context"/>
  </div>

</div>

</div>

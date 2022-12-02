<script>
  export let label = "Untitled";
  export let icon = "circle";
  export let context = "info";
  export let selected = false;

  export let menu = []; // {label: 'Rename', click:()=>{} }

</script>

<div class="d-inline rounded m-1 me-3 p-2" role="button" title="{name}" style="user-select: none;" class:text-bg-dark={selected}>

    <div class="text-center" on:click|stopPropagation on:dblclick|stopPropagation>
      <i class="bi bi-{icon} text-{context} fs-3 d-inline"></i>
    </div>

    {#if menu.length}
      <div class="btn-group">
        <button type="button" class="btn btn-sm btn-link p-0 w-100 text-truncate" on:click|stopPropagation on:dblclick|stopPropagation>{label}</button>
        <button type="button" class="btn btn-sm btn-link p-0 m-0 ms-2 float-end" data-bs-toggle="dropdown"><i class="bi bi-caret-down-fill text-action"></i></button>
        <ul class="dropdown-menu dropdown-menu-dark shadow">
          {#each menu as item}
            <li><a class="dropdown-item" on:click={item.click}>{item.label}</a></li>
          {/each}
        </ul>
      </div>
    {:else if $$slots.menu}
      <div class="btn-group">
        <button type="button" class="btn btn-sm btn-link p-0 w-100 text-truncate" on:click|stopPropagation on:dblclick|stopPropagation>{label}</button>
        <button type="button" class="btn btn-sm btn-link p-0 m-0 ms-2 float-end" data-bs-toggle="dropdown" data-bs-auto-close="outside"><i class="bi bi-caret-down-fill text-action"></i></button>
        <div class="dropdown-menu dropdown-menu-dark shadow p-2">
        <slot name="menu"></slot>
        </div>
      </div>
    {:else}
      <button type="button" class="btn btn-sm btn-link p-0 w-100 text-truncate" on:click|stopPropagation on:dblclick|stopPropagation>{label}</button>
    {/if}

</div>

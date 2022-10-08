<script>
  export let fs;
  export let path;
  import lo from 'lodash'
</script>

<!-- <pre>{JSON.stringify(fs.dir('/root') , null, '  ')}</pre> -->

<div class="ps-2 border ">
  {#each fs.dir(path) as inode (inode.id)}
    {#if inode.directory}
      <div class="text-warning">{inode.name}</div>
      <div>
        <svelte:self fs={fs} path={inode.path}/>
      </div>
    {:else}
      <div class="text-info">{inode.name}</div>
    {/if}
  {/each}
</div>
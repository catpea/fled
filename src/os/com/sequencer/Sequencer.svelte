<script>
  import lo from 'lodash';

  export let active = false;

  export let rows = 4;
  export let columns = 4;
  export let gap = 4;

  export let value;
  export let step;

  const width=32;
  const height=32;

  function even(step, width=4){
    const div = step / width;
    const floor = Math.floor(div);
    if(floor % 2===0) return true

  }
  function barrier(step, width=4){
    const mod = ((step % width) + width) % width
    if(mod===0) return true
  }


</script>
<style>
	svg.sequencer {
		width: 100%;
		height: 100%;
	}
  svg.sequencer rect.sequencer-pad {
    fill: var(--bs-body-color);
  }
  svg.sequencer rect.sequencer-pad.even {
    fill: var(--bs-emphasis-color);
  }
  svg.sequencer rect.sequencer-pad.on.inactive {
    fill: var(--bs-primary);
  }
  svg.sequencer rect.sequencer-pad.off.active {
    fill: var(--bs-emphasis-color);
  }
  svg.sequencer rect.sequencer-pad.on.active {
    fill: var(--bs-primary);
  }
  svg.sequencer rect.sequencer-pad.active {
    stroke: var(--bs-primary);
  }
</style>

<svg class="sequencer" viewBox='0 0 {(columns*32)+(columns*gap)} {(rows*32)+(rows*gap)}'>
  {#each value as row, rowIndex}
    {#each row as col, colIndex}
      <rect class="sequencer-pad" x={(colIndex*32)+(colIndex*gap)} y={(rowIndex*32)+(rowIndex*gap)} {width} {height} on:click={()=>{value[rowIndex][colIndex] = !value[rowIndex][colIndex];}} class:on={value[rowIndex][colIndex]} class:off={!value[rowIndex][colIndex]} class:active={step==colIndex} class:inactive={step!=colIndex} class:even={even(colIndex)}/>
    {/each}
  {/each}
</svg>

<script>
  import lo from 'lodash';
  import { onMount, onDestroy } from 'svelte';
	import { createEventDispatcher } from 'svelte';
  const cleanup = [];
  export let active = false;
  export let rows = 4;
  export let cols = 4;
  export let gap = 4;
  export let interval = 1_000;
  export let value;
  export let step = 0;
  let intervalID;
  const width=32;
  const height=32;

  let matrix = lo.times(rows, ()=>lo.times(cols, lo.stubFalse));

  $: {
    const diff = cols - matrix[0].length;
    console.log(diff);

    if(diff){

    if(matrix && matrix[0] && cols>matrix[0].length){
      for (let rowIndex = 0; rowIndex < matrix.length; rowIndex++) {
        matrix[rowIndex] = matrix[rowIndex].concat(lo.times(diff, lo.stubFalse))
        // matrix[rowIndex] = lo.times(diff, lo.stubFalse).concat(matrix[rowIndex])
      }
    }else{
      for (let rowIndex = 0; rowIndex < matrix.length; rowIndex++) {
        matrix[rowIndex] = matrix[rowIndex].slice(0,cols)
      }
    }
  }
    console.log(matrix);

  }

	const dispatch = createEventDispatcher();
  $: dispatch('change', matrix);
  $: value = matrix;
  $: if(active) intervalID = setInterval(next, interval, 'Parameter 1', 'Parameter 2');
  $: if(!active && intervalID) clearInterval(intervalID);
  function next(){
    step++;
    if(step>cols-1) step=0;
    dispatch('step', matrix.map(row=>row[step]));
  }
  onDestroy(()=>{
    if(intervalID) clearInterval(intervalID);
    cleanup.map(o=>o())
  })
</script>
<style>
	svg.sequencer {
		width: 100%;
		height: 100%;
	}
  svg.sequencer rect.sequencer-pad {
    fill: var(--bs-body-color);
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
<svg class="sequencer" viewBox='0 0 {(cols*32)+(cols*gap)} {(rows*32)+(rows*gap)}'>
  {#each matrix as row, rowIndex}
    {#each row as col, colIndex}
      <rect class="sequencer-pad" x={(colIndex*32)+(colIndex*gap)} y={(rowIndex*32)+(rowIndex*gap)} {width} {height} on:click={()=>{matrix[rowIndex][colIndex] = !matrix[rowIndex][colIndex];}} class:on={matrix[rowIndex][colIndex]} class:off={!matrix[rowIndex][colIndex]} class:active={step==colIndex} class:inactive={step!=colIndex}/>
    {/each}
  {/each}
</svg>

<script>


  import { onMount, onDestroy } from 'svelte';
  import Sequencer from '/src/os/com/sequencer/Sequencer.svelte';
  import Players from '/src/os/com/tone/players/Players.svelte';

  import {inflateMatrix, deflateMatrix, doubleMatrix} from '/src/os/com/matrix/matrix-mangler.js';

  import lo from 'lodash';
  import * as Tone from 'tone'
  // Tone.setContext(new Tone.Context({ latencyHint : "balanced" }))


  let columns = 16;
  let rows = 4;
  let matrix = lo.times(rows, ()=>lo.times(columns, lo.stubFalse));

  let columnDelta = 4;

  let sequencerActive = false;
  let step = 0;
  let subdivision = "16n";

  let names; // set my Players

  let players;
  let sequencer;


  $: console.log('Players changed', players)

  let userHasActivated = false;

  function play(){
    Tone.start(0);
    userHasActivated = true;
    reset();
    Tone.Transport.start();
    sequencer.start();
  }


  // Tick comes from Sequence - and controls the Players
  function tick(time, column){
    step = column;

    for (const [instrumentIndex, row] of matrix.entries()) {
      for (const [col,active] of row.entries()) {
        if(col==column){
          //console.log({time, column, col,row , instrumentIndex} );
          if(active){
            if(players){
              try{
                players.player(names[instrumentIndex]).start(time, 0, "16t");
              }catch(e){}
             }
          } // if play
        } // if column match
      } // for rows
    } // for all entries
  }

  let intervalId;

  function reset(){
    let offset = step;

    if(sequencer) {
      sequencer.mute = true; sequencer.cancel(); // These may not be needed, but there is an anomaly in the sound.
      sequencer.dispose();
    }
    sequencer = new Tone.Sequence(tick, lo.range(columns), subdivision);
    if(userHasActivated){

      sequencer.start(undefined, offset); // honor the activation;
    }
  }


onDestroy(()=>{
  sequencer.dispose();
  players.dispose();
})














  function handleChange(event) {
    console.log('Sequencer Issued Change');
    reset();
	}

  function handleStep(event) {
	}



</script>


<div class="container ">
  <div class="row align-items-start">
    <div class="col">
      <Players bind:value={players} bind:names bind:size={rows} />
    </div>
    <div class="col">
    columns={columns}
      <div class="btn-group btn-group-sm float-end my-2" role="group" aria-label="Basic example">

        <button type="button" class="btn btn-secondary py-0" on:click={()=>{ matrix=deflateMatrix(matrix, columnDelta); columns=matrix[0].length; reset(); }}><i class="bi bi-dash-circle"></i></button>
        <button type="button" class="btn btn-secondary py-0" on:click={()=>{ matrix=inflateMatrix(matrix, columnDelta); columns=matrix[0].length; reset(); }}><i class="bi bi-plus-circle"></i></button>
        <button type="button" class="btn btn-secondary py-0" on:click={()=>{ matrix=doubleMatrix(matrix, columnDelta); columns=matrix[0].length; reset(); }}><i class="bi bi-clipboard-plus"></i></button>
      </div>

      <Sequencer value={matrix} {step} {rows} {columns} gap={1} on:change={handleChange} on:step={handleStep}/>

      <button type="button" class="btn btn-secondary btn-sm my-3 me-1" on:click={()=>play()}>Play</button>
      <button type="button" class="btn btn-secondary btn-sm my-3 ms-1" on:click={()=>Tone.Transport.pause()}>Pause</button>
    </div>
  </div>
</div>

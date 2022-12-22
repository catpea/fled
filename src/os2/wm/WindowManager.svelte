<script>
  import '~xterm/css/xterm.css';

  import { Terminal } from 'xterm';
  import { History } from '/src/os-dom/app/terminal/History';

  import lo from 'lodash';

  import argsParser from 'yargs-parser/browser'; // lol

  // import Login from '/src/os/wm/ui/Login.svelte';
  // import Overwatch from '/src/os/wm/ui/Overwatch.svelte';
  // import Desktop from '/src/os/wm/ui/Desktop.svelte';
  // import Windows from '/src/os/wm/ui/Windows.svelte';
  // import Ports from '/src/os/wm/ui/Ports.svelte';

  let windows = []
  let off = 0;
  for (let index = 0; index < 10; index++) {
    off = off+32;
    windows.push({
      id: 'window-'+index,
      x:off+lo.random(-20,20),
      y:off+lo.random(-20,20),
      w:lo.random(200, 480),
      h:lo.random(200, 480),
    });
  }
  windows = lo.shuffle(windows);

  function terminal(node){


    const term = new Terminal({
    fontFamily: '"Cascadia Code", Menlo, monospace',
    // theme: baseTheme,
    cursorBlink: true,
    logLevel: 'debug',
    });

    // term.setOption('logLevel', 'debug');
    term.open(node);
    term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ')

    term.prompt = () => {
     term.write('\r\n$ ');
    };




 const history = new History();








 var command = '';

  term.onData(e => {



    console.log(  e.split('').map(o=>o.codePointAt(0)).map(i=>'*u'+i.toString(16).toUpperCase().padStart(4,0)).join('') );



    // console.log(e, '\\u' + lo.padStart(e.codePointAt(0), 4, '0'));

    // console.log(e, '\\u' + lo.padStart(e.codePointAt(1), 4, '0'));
    // console.log(e, '\\u' + lo.padStart(e.codePointAt(2), 4, '0'));

      switch (e) {

        case '\u0003': // Ctrl+C
          term.write('^C');
          prompt(term);
          break;

        case '\r': // Enter
          history.write(command);
          runCommand(term, command);
          command = '';
          break;

        case '\u001B\u005B\u0041': // Up
          history.decrement();
          if(history.exists()) term.write( '\u001B[2K ' + `\u001B[${term._core.buffer.y+1};${0}H`  + '$ '+ history.read() );
          break;

        case '\u001B\u005B\u0042': // Up
          history.increment();
          if(history.exists()) term.write( '\u001B[2K ' + `\u001B[${term._core.buffer.y+1};${0}H`  + '$ '+ history.read() );
          break;



        case '\u007F': // Backspace (DEL)
          // Do not delete the prompt
          if (term._core.buffer.x > 2) {
            term.write('\b \b');
            if (command.length > 0) {
              command = command.substr(0, command.length - 1);
            }
          }
          break;

        default: // echo: Print all other characters for demo
          if (e >= String.fromCharCode(0x20) && e <= String.fromCharCode(0x7E) || e >= '\u00a0') {
            command += e;
            term.write(e);
          }
      }
 });


 var commands = {
    help: {
      f: () => {
        term.writeln([
          'Welcome to xterm.js! Try some of the commands below.',
          '',
          ...Object.keys(commands).map(e => `  ${e.padEnd(10)} ${commands[e].description}`)
        ].join('\n\r'));
        prompt(term);
      },
      description: 'Prints this help message',
    },

    ls: {
      f: () => {
        term.writeln(['a', 'bunch', 'of', 'fake', 'files'].join('\r\n'));
        term.prompt(term);
      },
      description: 'Prints a fake directory structure'
    },

    ping: {
      f: (a) => {
        term.writeln(JSON.stringify(a));
        term.prompt(term);
      },
      description: 'Prints a fake directory structure'
    },


  };

    function prompt(term) {
     command = '';
     term.write('\r\n$ ');
   }

   function runCommand1(term, text) {



      const command = text.trim().split(' ')[0];
      if (command.length > 0) {
        term.writeln('');
        if (command in commands) {
          commands[command].f();
          return;
        }
        term.writeln(`${command}: command not found`);
      }
      prompt(term);
    }

   function runCommand(term, text) {

     const command = text.trim().split(' ')[0];
     const args = argsParser(text);

      if (command.length > 0) {
        term.writeln('');
        if (command in commands) {
          commands[command].f(args);
          return;
        }
        term.writeln(`${command}: command not found`);
      }
      prompt(term);
    }














  }


  </script>

This is just a normal web page.

<div class="desktop position-fixed m-5 border border-info bg-dark shadow rounded overflow-hidden" style="width: 1024px; height:768px;">
  {#each windows as window}

    <div data-id="win-{window.id}" class="window position-absolute bg-dark border border-5 border-info rounded overflow-auto" style="left: {window.x}px; top: {window.y}px; width: {window.w}px; height:{window.h}px;">
      <div class="window-handle border border-info rounded p-1" style="user-select: none;">My Little Program</div>

      <!-- {#each lo.range(1, 1000) as x }
      <span class="border border-danger">s</span> x
      {/each} -->

    </div>
  {/each}

  <!-- <div data-id="win-a" class="window position-absolute bg-dark border border-info rounded" style="left: 100px; top: 100px; width: 320px; height:200px;">
    <div class="window-handle border border-info rounded p-1" style="user-select: none;">My Little Program</div>
    A
  </div>

  <div data-id="win-b" class="window position-absolute bg-dark border border-info rounded" style="left: 130px; top: 130px; width: 320px; height:200px;">
    <div class="window-handle border border-info rounded p-1" style="user-select: none;">My Little Program</div>
    B
  </div>

  <div data-id="win-c" class="window position-absolute bg-dark border border-info rounded" style="left: 160px; top: 160px; width: 320px; height:200px;">
    <div class="window-handle border border-info rounded p-1" style="user-select: none;">My Little Program</div>
    C
  </div> -->


  <div data-id="terminal-0" class="window position-absolute border border-dark rounded shadow overflow-auto" style="left: 10px; top: 10px; width: 320px; height:200px; background-color:var(--bs-black)">
    <div class="window-handle p-1 small" style="user-select: none;">terminal</div>
    <div use:terminal></div>
  </div>

  <svg class="desktop-glass pe-none position-absolute" style="left: 0px; top: 0px; width: 100%; height:100%;"></svg>
</div>

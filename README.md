# fled

HTTP based code editor for functional programming

## Developers

Just run ```npm run dev```, and click on the http:// to connect to the interface

## Development Notes
use EventEmitter
use #if it helps to deal with chicken and egg problems.
remember that left hand must be clear for the compiler to see it.

## Editor spacevim
SPC f v d

[[layers]]
  name = "lang#html"
  emmet_leader_key = "<C-e>"
  emmet_filetyps = ['html']


:set filetype=html
autocmd BufRead,BufNewFile *.svelte set filetype=html


### Things

Finite State Machine

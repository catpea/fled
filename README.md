# fled

HTTP based code editor for functional programming


## Developer Note

### TODO


File passthrough socket-io proxy that movers files into puichdb for editing
Wiki Pane + Vim editor,
Midnight COmmander 2 Pane approach
Above all Automator for file operations
(Tree+Midnight-Comander) Scene Graph Editor where nodes are first the way cells are first in spreadsheet programs


### document server

To load a new CouchDB document simply say: ```document.id = some_id```,
the ```document``` mentioned above is a svelte store like object.

.id is a setter that will trigger fetching the CouchDB doc,
and eventually whoever is lightening to document via $document auto-binding,
will get the doc with the requested id.

think of the document as a server that serves CouchDB docs,
by assigning a new id, it will provide you with the matching doc.

perhaps a better way would be load(new_id) document.id = some_id is prettier.

You do not need to provide an ID, the document/Document tolerates not having an id,
this way, the "server" can be setup before it is put into play.

The mini-apps withing use ```import { db, document } from './my-mini-app/store.js';``` approach,
for inter mini-app communication, so this is possible now:

```html
{#each some_list as {id, label}}
  <button class="btn btn-link" on:click={()=> document.id = id } >{label}</button>
{/each}
```

## Patterns

### Icons

- bi-wrench-adjustable
- bi-terminal-split
- bi-box2-heart
- bi-device-ssd
- bi-gem
- bi-journal-richtext
- bi-motherboard
- bi-palette
- bi-plugin
- bi-shop


Scene Graph


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

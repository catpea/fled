# fled

HTTP based code editor for functional programming

https://allorigins.win/

## Developer Note

Keep the database flat, no trees, keep it simple, relating records together is about storing referenced to record ids that need to be related.




app.context.db = db();

app.use(async ctx => {
  console.log(ctx.db);
});


app.on('error', (err, ctx) => {
  log.error('server error', err, ctx)
});


app.use(async ctx => {
  ctx; // is the Context
  ctx.request; // is a Koa Request
  ctx.response; // is a Koa Response
});


ctx.state
The recommended namespace for passing information through middleware and to your frontend views.
ctx.state.user = await User.find(id);



    checkout
    copy
    delete
    get
    head
    lock
    merge
    mkactivity
    mkcol
    move
    m-search
    notify
    options
    patch
    post
    purge
    put
    report
    search
    subscribe
    trace
    unlock
    unsubscribe


### TODO

- electron
- electronforge
- Electron Release Server
- scrapeit
- File passthrough socket-io proxy that movers files into puichdb for editing
- Wiki Pane + Vim editor,
- Midnight COmmander 2 Pane approach
- Above all Automator for file operations
- (Tree+Midnight-Comander) Scene Graph Editor where nodes are first the way cells are first in spreadsheet programs

### Applications

- Drag And Drop Layout Editor
- Color Theme Designer
- Web Services Builder
- Noise Machine
- Song Beat Coutiner
- Alone Song Generator
- Bootstrap Shadow Generator
- Bootstrap Container Generator
- BUtton Customizer
- CSS Box Shadow
- CSS Text Shadow
- CSS CSS Cursor
- CSS Border
- CSS Border Radius
- CSS Gradient CSS
- CSS Transform CSS
- CSS RGBA & Hex Color
- CSS Multiple Columns
- CSS Filter
- CSS Border Radius Generator
- CSS Button Generator
- CSS Column Generator
- CSS Flip Swith Generator
- CSS Gradient Generator
- CSS Scrollbar Generator
- CSS Image Filters
- CSS Layout Generator
- CSS Sprite Generator
- CSS Ribbon Generator
- CSS Text Rotate Generator
- CSS Tooltip Generator
- CSS Tooltip Generator
- CSS 3D Transform Generator
- CSS Box Shadow Generator
- CSS Clip Path Generator
- CSS Cubic Bezier Generator
- CSS Flexbox Generator
- CSS Loader Generator
- CSS Text Gradient Generator
- CSS Input Range Generator
- CSS Menu Generator
- CSS RGBA Generator
- CSS Text Shadow Generator
- CSS Ribbon Banner Generator
- CSS Triangle Generator


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

### Scratch

new card


Tab for DB operations
Card To Export DB

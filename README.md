# fled - [fl]ow [ed]itor

a code editor with plenty of space

## Quest For The Window / Initial Boot Sequence
- main.js loads App
- App.svelte loads manager
  - configures database, loads data
  - initializes bus and base events,
- Manager.svelte loads desktop
- Desktop loads Windows
  - asks for window listing in the default desktop
- Window asks for whatever component/app the window id calls for

## Operating System Architecture

- src/os
  - app (collection of applications)
    - DesktopSwitcher (the first app switches list of current windows)  
  - ui (gets the UI setup)
    - Manager (WindowManager)
      - Desktop (a window container allows panning, etc.)
      - Window
      - Terminal (an app, but so important it lives next to the window)
  - bus (this is the API)
    - all terminal commands are just events
    - all database calls must go through the bus
    - integrates with web sockets and the server
    - cross tab and cross window
  - bin (commands, or bus listeners)
  - vfs (probably an object, probably not observable (manual refresh))
  - db main storage, a document store
  - dom - low level DOM components

## Client Architecture

- Svelte App, Applications that use Svelte Components
- Svelte Components, just reusable things, ordinary components
- Svelte Base Components, Manager (Window Manager) Desktop, Window, Terminal (a core but sub application)
- Observable Database, All documents tagged with GUID, DB Layer
- For use with svelte's use:xxx Low Level Components, DOM Layer
- Bus, Emitter Layer

## Server Architecture

- Server App, presumably a mountable construct
- Server, just web sockets, they work well with the OS bus.

## Application Architecture Client + Server

- scripts, probably just shell scripts
- node module, or just server.js and packages.json

## Window Layout Strategy
- main element (window)
  - holds the width, height, as well as top, and left (normalized to .w .h .y .x)
  - can contain window-caption which will drag the window.
  - is a flex layout element: d-flex
  - contents are stretched by default: align-items-stretch
  - contents are treated as a column: flex-column
  - there is a window-status on the bottom
  - window-body
    - is set to grow: flex-grow-1
    - is set to overflow-x-auto
    - window body can now use h-100 w-100 due to flex arrangement


## Conventions

- Primary desktop should always be called 'primary'.

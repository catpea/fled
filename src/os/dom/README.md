Architecture
---

On the first level we have the major concepts that make up the system,
each has a directory with sub components and a reusable utility library.
example: Window has a window directory that contains Movable.js

```JavaScript

import Bus from '/src/os-dom/Bus.js';
import Desktop from '/src/os-dom/Desktop.js';
import Window from '/src/os-dom/Window.js';

const bus = new Bus();
// systemBus.on('delta', event=>console.log(event))

const desktopElement = document.querySelector('.desktop');
const desktop = new Desktop(desktopElement, bus, {});

const windows = [...desktopElement.querySelectorAll('.window')];
windows.forEach(windowElement => {
 new Window({bus, desktop, element:windowElement});
});

```

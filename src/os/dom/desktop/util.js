export function getWindows(desktopElement){
  return [...desktopElement.children]
    .filter(element => element.matches('.window'))
    .map(element => ({id:element.dataset.id, element}))
}

export function isCursorOut(element, {clientY, clientX}){
  // Cursor Overflow
  let desktopStyle = window.getComputedStyle(element);
  let desktopRect = element.getBoundingClientRect();

  let dx1 = desktopRect.x;
  let dy1 = desktopRect.y;
  let dy2 = desktopRect.bottom - (parseInt(desktopStyle.border)*2);
  let dx2 = desktopRect.right - (parseInt(desktopStyle.border)*2);

  const gap = 5;

  const cursorOverflowTop =    (event.clientY-parseInt(desktopStyle.border)) <= dy1+gap;
  const cursorOverflowRight =  (event.clientX-parseInt(desktopStyle.border)) >= dx2+gap;
  const cursorOverflowLeft =   (event.clientX-parseInt(desktopStyle.border)) <= dx1-gap;
  const cursorOverflowBottom =  (event.clientY-parseInt(desktopStyle.border)) >= dy2-gap;

  if(cursorOverflowTop||cursorOverflowRight||cursorOverflowLeft||cursorOverflowBottom){
    return true;
  }else{
    return false;
  }

}

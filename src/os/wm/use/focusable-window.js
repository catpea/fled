//NOTE: consider that z-index is not stored between reboots on a normal OS, it may not need to be stored here as well.
export function focusableWindow(primaryNode){

    primaryNode.addEventListener('mousedown', start, false);
    primaryNode.addEventListener('mouseup', end, false);

    function start(){
      const zIndex = parseInt(window.performance.now());
      primaryNode.style.zIndex = zIndex;
    }

    function end(){
      // this maybe a good place to save it to database
    }

}

// create custom events
const dropDetectEvent = new CustomEvent('dropdetect', {
  detail: {
    name: 'cat'
  }
});

function dropDetect(e) {
  e.target.classList.add('drag-over');
}

function dragStart(e) {

    const candidates = document.querySelectorAll(".drop-candidate");
    candidates.forEach(el => {
      el.dispatchEvent(dropDetectEvent);
    })

    e.dataTransfer.setData('text/plain', e.target.id);
    setTimeout(() => {
        e.target.classList.add('hide');
    }, 0);

}

function dragEnter(e) {
    e.preventDefault();
    e.target.classList.add('drag-over');
}

function dragOver(e) {
    e.preventDefault();
    e.target.classList.add('drag-over');
}

function dragLeave(e) {
    e.target.classList.remove('drag-over');
}

// function drop(e) {
//     e.target.classList.remove('drag-over');
//
//     // get the draggable element
//     const id = e.dataTransfer.getData('text/plain');
//     const draggable = document.getElementById(id);
//
//     // add it to the drop target
//     e.target.appendChild(draggable);
//
//     // display the draggable element
//     draggable.classList.remove('hide');
// }




////////////////////////



function drag(node){
  // node.setAttribute("draggable", true);
  // node.addEventListener('dragstart', dragStart);
  //
  // node.classList.add('border');
  // node.classList.add('border-design');

}

function drop(node){
  // node.addEventListener('dragenter', dragEnter)
  // node.addEventListener('dragover', dragOver);
  // node.addEventListener('dragleave', dragLeave);
  // node.addEventListener('dropdetect', dropDetect);
  // node.classList.add('drop-candidate');
  // node.classList.add('border');
  // node.classList.add('border-design');
}



  //on:dragover={(event)=>(parseInt(event.dataTransfer.getData("text/plain"))==index)?null:event.preventDefault()}
   // node.addEventListener('dragover', dragOver);

export {drag, drop};

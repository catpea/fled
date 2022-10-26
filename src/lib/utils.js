export default function utils(data){
  
  function inodes(a) {
    return data.edges.map(({ data: { source, target } }) => ({ source, target })).filter(({ source, target }) => source == a).map(({ target }) => target);
  }
  function byId(id) {
    const results = data.nodes.filter(({ data }) => data.id == id);
  return results.length ? results[0] : []
}

  function ls(a) {
    return inodes(a).map(id => byId(id))
  }
  
  function ix(a) {
    //data.nodes.indexOf(a);
    const found = data.nodes.map(({data:{id}},index)=>id==a?index:undefined).filter(i=>i!==undefined)
    console.log(`Searching for ${a}`, found);
    return found.length?found[0]:false
  }

  return {ls,ix};

}
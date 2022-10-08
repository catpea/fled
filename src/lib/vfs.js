import lo from 'lodash'

if (import.meta.hot) {
  import.meta.hot.decline()
}

export default function vfs(raw){
  console.log('Preparing HDD');
  function dirname(str, { sep = '/' } = {}) {
    return lo.initial(str.split(sep)).join(sep)
  }
  function unfurl(fragments) {
    const response = [];
    for (let a = fragments.length - 1; a > -1; a--) {
      response[a] = [];
      for (let b = a; b < fragments.length; b++) {
        response[b][a] = fragments[a];
      }
    }
    return response;
  }
  
  const ls = (path, data = tree) => lo.get(data, lo.initial(path.replace(/^\//, '').replace(/\/$/, '').split('/').map(o => [o, 'elements']).flat()))
  const dir = (path, data = tree) => {
    console.log(path);
    const response = Object.entries(ls(path, data).elements).filter(([path, inode]) => inode.directory || inode.file).map(([path, inode]) => Object.assign({}, inode, { elements: undefined }))
    return response
  }


  const tree = {};
  const unfurled = lo.uniqBy(raw.map(o => dirname(o)).filter(o => o !== '.').map(o => o.split('/')).map(o => unfurl(o)).flat(1), o => o.join())


  unfurled.map(o => o.map(o => [o, 'elements']).flat()).map(o => lo.set(tree, o.map(o => o), {}))
  unfurled.map(o => lo.initial(o.map(o => [o, 'elements']).flat())).map(o => lo.set(tree, o.map(o => o), { id: o.join('/'), path: o.filter(o=>o!='elements').join('/'),  name: lo.nth(o, -1), directory: true, created: false }))
  raw.map(o => o.split('/')).map(o => lo.initial(o.map(o => [o, 'elements']).flat())).map(o => lo.set(tree, o.map(o => o), { id: o.join('/'), name: lo.nth(o, -1), file: true }))
  
  return { tree, dir };
}
import lo from 'lodash';

// setThis({node}, 'event'...), where event is the labe of ...arg
export function setThis(external, ...names){
  return function setter(...values){
    const internal = Object.fromEntries(lo.zip(names, values));
    Object.assign(this, external, internal);
  }
}

export function dumpThis(label){

  if(!label){
    console.log(label||'dump this', this)
  }else{
    return function(){
      console.log(label||'dump this', this)
    }
  }

}

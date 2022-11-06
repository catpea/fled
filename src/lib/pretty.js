import prettier from 'prettier';
import parserBabel from "prettier/parser-babel.js";

import hljs from 'highlight.js/lib/core';
import json from 'highlight.js/lib/languages/json';
import javascript from 'highlight.js/lib/languages/javascript';
import 'highlight.js/styles/base16/tomorrow-night.css';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('json', json);

function pretty(code, options){
  const language='javascript';

  let response = '';

  try{
  response = prettier.format(code, { semi: true, parser: "babel", plugins:[parserBabel] });
  }catch(e){
    response = code;
  }

  if(options.highlight){
    response = hljs.highlight(response, {language}).value;
  }

  return response;
}

export {pretty};

/*
 *  experiemental JSX engine to support React
 *  should be completely self-contained so that no changes
 *  are needed to the other patternlab pieces
 */

"use strict";

var fs = require("fs-extra")

var JSX = function(){
    console.log("running the JSX engine!!")
}

var engine_jsx = {
  engine: JSX,
  engineName: 'jsx',
  engineFileExtension: '.jsx',
  expandPartials: true,
  // render it
  renderPattern: function (pattern, data, partials) {
      // TODO: get this rendering during build process, so that the returned HTML is the rendered component, not the empty div
      // this will also allow them all to render appropriately without having to mount the react components
      // limitation is that there's no JS functionality on the "all" pages, but maybe this doesn't matter?
      
      // need to write a file called index.js that uses the pattern name...
      // TODO: get name of element and markup pattern to insert here dynamically
      fs.outputFileSync("public/patterns/"+pattern.name+"/index.js", "import PE_proto_button from '"+pattern.name+".jsx'; ReactDOM.render(<PE_proto_button>Button loaded from "+pattern.name+"</PE_proto_button>,document.getElementById('"+pattern.name+"'));")
      
      // need to render the pattern out
      // idea right now is to return a root div to be replaced
      // TODO: return a complete set of markup here, wrapped in the ID, so that if react is active it will still work
      return '<div id="'+pattern.name+'">loading '+pattern.name+'.jsx</div>'
  },
  patternMatcher: function (pattern, regex) {
    return true;
  },
  findPartials: function (pattern) {
    return true;
  },
  findPartialsWithStyleModifiers: function (pattern) {
    return true;
  },
  findPartialsWithPatternParameters: function (pattern) {
    return true;
  },
  findListItems: function (pattern) {
    return [true, true];
  },
  findPartial_new: function (partialString) {
    return true;
  },
  findPartial: function (partialString) {
    return true;
  }
};

module.exports = engine_jsx;

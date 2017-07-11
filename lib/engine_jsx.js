/*
 *  experiemental JSX engine to support React
 *  should be completely self-contained so that no changes
 *  are needed to the other patternlab pieces
 */

"use strict";

require("node-jsx").install({extension: ".jsx"});

var fs = require("fs-extra"),
    React = require("react"),
    ReactDOM = require("react-dom"),
    ReactDOMServer = require("react-dom/server"),
    babel = require("babel-core")

var engine_jsx = {
  engine: React,
  engineName: 'jsx',
  engineFileExtension: '.jsx',
  expandPartials: true,
  // render it
  renderPattern: function (pattern, data, partials) {
      // pattern -- the chunk of data for the pattern with all associated info
      // data -- the data.json file
      // partials -- undefined
      // get it to render itself into an element
      // using reactDomServer.renderToStaticMarkup(element)
      
      // TODO: you will have a problem if you do this before a file has been written
      // they write synchronously :P
      // TODO: Investigate a packager to make this cleaner, maybe?
      var regex = /import\s.*\sfrom\s.*/,
            imports = pattern.template.match(regex),
            newCode = pattern.template
      if(imports !== null){
          for(let i=0;i<imports.length;i++){
              var Import = imports[i],
                  reg2 = /import\s.*\sfrom\s/,
                  origUrl = Import.replace(reg2, "").replace(/\"/g, ""),
                  newUrl = process.cwd()+'/source/_patterns/'+origUrl+'.tmp'
              newCode = newCode.replace(origUrl, newUrl)
          }
          
      }
      // use the un-babeled data and run through babel
      var babeled = babel.transform(newCode, {
          presets : ["es2015", "react"]
      })
      // append the includes for React and the export call at the end
      // use pattern.fileName for the export
      newCode = 'var React = require("react");\n'+babeled.code+'\n module.exports = '+pattern.fileName+''
      
      // put in an intermediate location and use to render element below
      // save the file out to a build location to be removed... /source/_patterns/pattern.relPath+.tmp
      fs.writeFileSync(process.cwd()+'/source/_patterns/'+pattern.relPath+".tmp", newCode)
      
      var element = React.createFactory(require(process.cwd()+'/source/_patterns/'+pattern.relPath+".tmp"))
      var html = ReactDOMServer.renderToStaticMarkup(element({
          children : "Test Button"
      }))
      
      // TODO: get it working in the browser with full React.JS rendering
      
      // TODO: Remove the .tmp file that you created above
      
      // return the HTML pattern
      return html
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
    return [];
  },
  findPartial_new: function (partialString) {
    return true;
  },
  findPartial: function (partialString) {
    return true;
  }
};

module.exports = engine_jsx;

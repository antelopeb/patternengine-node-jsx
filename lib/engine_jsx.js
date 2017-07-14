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
    
const uuidv1 = require('uuid/v1')

var engine_jsx = {
  engine: React,
  engineName: 'jsx',
  engineFileExtension: '.jsx',
  expandPartials: false,
  // render it
  renderPattern: function (pattern, data, partials) {
      // pattern -- the chunk of data for the pattern with all associated info
      // data -- the data.json file
      // partials -- undefined
      
      // get it to render itself into an element
      // using reactDomServer.renderToStaticMarkup(element)
      
      // TODO: be wary of rendering order here... in theory, it shouldn't be a problem
      // as a component should never call another component if it doesn't exist
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
      newCode = 'var React = require("react");\n'+babeled.code+'\n'
      // replace the exports.default with module.exports
      newCode = newCode.replace("exports.default", "module.exports")
            
      var element = React.createFactory(eval(newCode)),
          useData = {
                children : "Test Child",
                data : data
            },
          html = ReactDOMServer.renderToStaticMarkup(element(useData))
      
      // TODO: get it working in the browser with full React.JS rendering
      // TODO: known issue - remove extraneous stuff for HTML only view
      // TODO: rewrite URL's of dependencies so they load properly
      
      // generate the markup, including all the stuff needed to render it
      var toReturn,
          htmlTemplate = fs.readFileSync(process.cwd()+"/node_modules/patternengine-node-jsx/lib/pageTemplate.html", "UTF-8"),
          jsTemplate = fs.readFileSync(process.cwd()+"/node_modules/patternengine-node-jsx/lib/testingJsTemplate.js", "UTF-8")
      var uuid = uuidv1()
      uuid = uuid.replace(/-/g, "")
      toReturn = htmlTemplate
      .replace(/\{\{uuid\}\}/g, uuid)
      .replace(/\{\{content\}\}/g, html)
      
      // generate the testing{uuid}.js file and save to js directory
      var jsFile = jsTemplate
      .replace(/\{\{uuid\}\}/g, uuid)
      .replace(/\{\{elementName\}\}/g, pattern.fileName)
      .replace(/\{\{elementFileNameNoJsx\}\}/g, pattern.name)
      .replace(/\{\{elementFileName\}\}/g, pattern.name+".jsx")
      .replace(/\{\{dataJson\}\}/g, JSON.stringify(useData))
      fs.writeFileSync(process.cwd()+"/public/js/testing"+uuid+".js", jsFile)
      
      // return the HTML pattern
      return toReturn
  },
  patternMatcher: function (pattern, regex) {
    return [];
  },
  findPartials: function (pattern) {
    return [];
  },
  findPartialsWithStyleModifiers: function (pattern) {
    return [];
  },
  findPartialsWithPatternParameters: function (pattern) {
    return [];
  },
  findListItems: function (pattern) {
    return ["foo", "bar"];
  },
  findPartial_new: function (partialString) {
    return [];
  },
  findPartial: function (partialString) {
    return [];
  }
};

module.exports = engine_jsx;

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
      var regex = /import.*from.*/g,
            imports = pattern.template.match(regex),
            newCode = pattern.template
      if(imports !== null){
          for(let i=0;i<imports.length;i++){
              // only target internal deps, not materialUI, etc...
              var Import = imports[i],
                  reg2 = /import\s.*\sfrom\s/,
                  origUrl = Import.replace(reg2, "").replace(/\"/g, ""),
                  newUrl = process.cwd()+'/source/_patterns/'+origUrl+'.tmp'
              if(origUrl.indexOf(".jsx") > -1){
                  newCode = newCode.replace(origUrl, newUrl)
              }
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
      // write your .tmp file out to your core dir for re-use
      fs.writeFileSync(process.cwd()+'/source/_patterns/'+pattern.relPath+'.tmp', newCode)
      var element = React.createFactory(eval(newCode)),
          useData = {
                children : "Test Child",
                data : data
            },
          html = ReactDOMServer.renderToStaticMarkup(element(useData))
      
      // TODO: known issue - remove extraneous stuff for HTML only view
      
      // TODO: rewrite URL's of dependencies so they load properly
      // will also need to rewrite the file with the new URL's
      // -- local URL's need to go from:
      // "00-atoms/buttons/PE_proto_button.jsx"
      // to:
      // "../00-atoms-buttons-PE_proto_button/00-atoms-buttons-PE_proto_button.jsx"
      // -- other URL's need to do this or something similar:
      // "prop-types"
      // to:
      // "../../../node_modules/prop-types/index.js"
      let name = pattern.name,
          fileData = pattern.template,
          pubUrl = process.cwd()+"/public/patterns/"+name+"/"+name+".jsx"
      // look for imports and rewrite URL's
      if(imports != null){
          for(let i=0;i<imports.length;i++){
              var Import = imports[i],
                  reg2 = /import\s.*\sfrom\s/,
                  origUrl = Import.replace(reg2, "").replace(/\"/g, "").replace(/\'/g, ""),
                  newUrl
              if(origUrl.indexOf(".jsx") > 0){
                  // it's an internal JSX file
                  newUrl = origUrl
                           .replace(".jsx", "")
                           .split("/")
                           .join("-")
                  newUrl = "../../patterns/" + newUrl + "/" + newUrl + ".jsx"
              } else {
                  // it's an external URL like Material UI
                  // use the package.json to get the main file, if there is one
                  // if it's got a slash in it, then just assume there's an index.js file
                  // assume that node_modules is in the root of public
                  if(origUrl.indexOf("/") > 0){
                      // assume it's index.js
                      newUrl = "../../node_modules/"+origUrl+"/index.js"
                  } else {
                      // read in the package.json file
                      var packageJson = fs.readFileSync(process.cwd()+"/node_modules/"+origUrl+"/package.json", "UTF-8")
                      packageJson = JSON.parse(packageJson)
                      newUrl = "../../node_modules/"+origUrl+"/"+packageJson.main
                  }
              }
              fileData = fileData.replace(origUrl, newUrl)
          }
      }
      setTimeout(function(){
          let date = new Date()
          date = date.toTimeString().split(" ")[0]
          console.log("["+date+"] Re-writing Public JSX File '"+name+"'")
          fs.writeFileSync(pubUrl, fileData)
      }, 100)
      
      
      // generate the markup, including all the stuff needed to render it
      var toReturn,
          htmlTemplate = fs.readFileSync(process.cwd()+"/node_modules/patternengine-node-jsx/lib/pageTemplate.html", "UTF-8"),
          jsTemplate = fs.readFileSync(process.cwd()+"/node_modules/patternengine-node-jsx/lib/testingJsTemplate.js", "UTF-8")
      var uuid = "el_"+uuidv1()
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
      
      // test if the JS dir is there, make it if not
      var exists = fs.existsSync(process.cwd()+"/public/js/")
      if(!exists){
          // no directory, make it
          fs.mkdirSync(process.cwd()+"/public/js/")
      }
      
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

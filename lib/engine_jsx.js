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
    ReactDOMServer = require("react-dom/server")

var engine_jsx = {
  engine: React,
  engineName: 'jsx',
  engineFileExtension: '.jsx',
  expandPartials: true,
  // render it
  renderPattern: function (pattern, data, partials) {
      // data is a string of javascript
      // get it to render itself into an element
      // using reactDomServer.renderToStaticMarkup(element)
      var element = React.createFactory(require(process.cwd()+'/source/_patterns/'+pattern.relPath))
      var html = ReactDOMServer.renderToStaticMarkup(element({
          children : "Test Button"
      }))
      
      // it's returning the file now, but it's not working in the browser...
      // TODO: get it working in the browser with JS rendering

      // put the pattern in this DIV so that it can be rendered properly when the JS comes in
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

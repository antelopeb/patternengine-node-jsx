PatternLab JSX Engine
==============

This is an experimental pattern engine for use with Patternlab and React.js / JSX based components. The engine right now handles React components build with the class methodology, and compiles through Babel to usable code.

It outputs the HTML in a usable form, and parts without dependencies are loading properly in the browser. Components with deps are loading properly in the browser, if the dep is from within the patternlab. If it is an outside dep, such as Material UI, then it is not working properly.

Other known problems: 
* testing.js files that are generated for each element clutter up public/js due to the fact that they are not cleaned during the PatternLab build. Need to come up with a way to clean them up.
* The .tmp files being written during the generation of HTML are left in place.
* The .tmp files are being written at the end of the process, which is not ideal and not using the PatternLab effectively.

Installation
---------
Needs to be npm linked into a patternlab to work right now, will eventually be installable via NPM.

Name components with the name you want the element to have:
an element x\_button becomes x\_button.jsx

Add a symlink to node\_modules in your public folder, so that dependencies can be accessed from the publicly served site as well. Only dependencies that are brought in via require in a React.js component need to be included in the publicly accessible node\_modules.

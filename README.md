# patternengine-node-jsx
This is an experimental pattern engine for use with Patternlab and React.js / JSX based components. The engine right now handles React components build with the class methodology, and compiles through Babel to usable code.

It outputs the HTML in a usable form, and parts without dependencies are loading properly in the browser. Components with deps are not loading properly in the browser yet, because they have to have URL transforms that work properly in public. This is a problem, because they need to be in the form they are now to render HTML properly, so when they are transformed is a question...

Other known problem - testing.js files that are generated for each element clutter up public/js due to the fact that they are not cleaned during the PatternLab build.


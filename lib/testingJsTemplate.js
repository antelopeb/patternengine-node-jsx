// import the pattern
import {{elementName}} from "./../patterns/{{elementFileNameNoJsx}}/{{elementFileName}}"

// write data static into this file
var props = {{dataJson}}

// render the pattern
var points = document.querySelectorAll(".{{uuid}}")
for(let i=0;i<points.length;i++){
    var point = points[i]
    ReactDOM.render(
        <{{elementName}}>{props.children}</{{elementName}}>,
        point // use the uuid generated for the dom
    );
}

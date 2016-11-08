# simpleCanvas2D
A simple 2d canvas toolkit
自用的一些canvas 2d图形lib

# Getting Started
```javascript
var canvasTool = new CanvasTool(document.getElementsByTagName('canvas')[0]);
var circle = new canvasTool.Circle(x,y,radius,color);
var shiningStar = new canvasTool.Star(x,y,width,height,color);
var meteor = new canvasTool.Meteor(x, y, width, length, color, speed);
function render(){
  circle.render();
  shiningStar.render();
  meteor.render();
  window.requestAnimationFrame(render);
}
render();
```

All figure has its own animation, pull request are warmly welcomed.

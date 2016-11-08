(function(exports) {
  function HEXToRGB(value) {
    var a = value;
    if (a.substr(0, 1) == "#")
      a = a.substring(1);

    a = a.toLowerCase();
    b = [];
    for (x = 0; x < 3; x++) {
      b[0] = a.substr(x * 2, 2);
      b[3] = "0123456789abcdef";
      b[1] = b[0].substr(0, 1);
      b[2] = b[0].substr(1, 1);
      b[20 + x] = b[3].indexOf(b[1]) * 16 + b[3].indexOf(b[2]);
    }
    return {
      r: b[20],
      g: b[21],
      b: b[22]
    };
  }

  function toRGBAColorObject(value) {
    if (value.indexOf('#') >= 0) {
      var object = HEXToRGB(value);
      object.a = 1;
      return object;
    }
    if (value.indexOf('rgba') >= 0) {
      var regex = /rgba\(\s?(\d{1,3})\s?,\s?(\d{1,3})\s?,\s?(\d{1,3})\s?,\s?(\d?\.?\d)\s?\)/g;
      var array = regex.exec(value);
      return {
        r: array[1],
        g: array[2],
        b: array[3],
        a: array[4]
      };
    }
    //暂不支持HSLA，只认为剩下就是rgb;
    var regex = /rgb\(\s?(\d{1,3})\s?,\s?(\d{1,3})\s?,\s?(\d{1,3})\s?\)/g;
    var array = regex.exec(value);
    return {
      r: array[1],
      g: array[2],
      b: array[3],
      a: 1
    };
  }

  function CircleClassGenerator(context) {
    var Circle = function Circle(x, y, radius, color) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.color = color;
      this.context = context;

      this.bigging = true;

      //animate
      var maxRadius = 8;
      var minRadius = 4;
      var circle = this;

      function animate() {
        if (circle.bigging)
          circle.radius += 1 / 60;
        else
          circle.radius = circle.radius - 1 / 60;
        if (circle.radius > maxRadius)
          circle.bigging = false;
        if (circle.radius < minRadius)
          circle.bigging = true;
      }
      if (window.requestAnimationFrame) {
        function handler() {
          window.requestAnimationFrame(handler);
          animate();
        }
        window.requestAnimationFrame(handler);
      } else {
        setInterval(animate, 1000 / 60);
      }
    };
    Circle.prototype.render = function() {
      var context = this.context;
      context.save();
      context.beginPath();
      context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, true);
      context.closePath();
      context.fillStyle = this.color;
      context.fill();
      context.restore();
    };
    return Circle;
  }

  function StarClassGenerator(context) {
    var Star = function Star(x, y, width, height, color) { // min/max
      this.x = x;
      this.y = y;
      this.color = color;
      this.context = context;

      var min, max;
      if (width > height) {
        min = height;
        max = width;
      } else {
        min = width;
        max = height;
      }
      this.min = min;
      this.width = width;
      this.spacing = max - min;
      //height = min + spacing - width
      //animate
      this.flatting = false;
      var star = this;

      function animate() {
        if (star.flatting)
          star.width += 1 / 60 * 10;
        else
          star.width -= 1 / 60 * 10;
        if (star.width > max)
          star.flatting = false;
        if (star.width < min)
          star.flatting = true;
      }
      if (window.requestAnimationFrame) {
        function handler() {
          window.requestAnimationFrame(handler);
          animate();
        }
        window.requestAnimationFrame(handler);
      } else {
        setInterval(animate, 1000 / 60);
      }
    };
    Star.prototype.render = function() {
      var context = this.context;
      context.save();
      context.beginPath();
      var height = this.min + this.spacing - (this.width - this.min);
      var left = {
        x: (this.x - this.width),
        y: this.y
      };
      var top = {
        x: this.x,
        y: (this.y - height)
      };
      var bottom = {
        x: this.x,
        y: (this.y + height)
      };
      var right = {
        x: (this.x + this.width),
        y: this.y
      };
      context.moveTo(left.x, left.y);
      context.quadraticCurveTo(this.x, this.y, top.x, top.y);
      context.quadraticCurveTo(this.x, this.y, right.x, right.y);
      context.quadraticCurveTo(this.x, this.y, bottom.x, bottom.y);
      context.quadraticCurveTo(this.x, this.y, left.x, left.y);
      context.closePath();
      context.fillStyle = this.color;
      context.fill();
      context.restore();
    };
    return Star;
  }

  function MeteorClassGenerator(context, width, height) {
    var containerWidth = width;
    var containerHeight = height;

    var Meteor = function Meteor(x, y, width, length, color, speed) { // min/max
      this.x = x;
      this.y = y;
      this.width = width;
      this.length = length;
      this.context = context;
      this.color = color;
      this.speed = speed;

      var meteor = this;

      function animate() {
        var speed = meteor.speed ? meteor.speed : 5;
        meteor.x -= 1 * speed;
        meteor.y += 1 * speed;

        var endPoint = meteor.getEndPoint(meteor.x, meteor.y);
        if ( /* endPoint.x < 0 ||  */ endPoint.y > containerHeight) {
          meteor.x += meteor.y;
          meteor.y = 0;
        }
      }
      if (window.requestAnimationFrame) {
        function handler() {
          window.requestAnimationFrame(handler);
          animate();
        }
        window.requestAnimationFrame(handler);
      } else {
        setInterval(animate, 1000 / 60);
      }
    };
    Meteor.prototype.getEndPoint = function getEndPoint(x, y) {
      return {
        x: this.x + this.length / (Math.sqrt(2)),
        y: this.y - this.length / (Math.sqrt(2))
      };
    };
    Meteor.prototype.render = function() {
      var context = this.context;
      context.save();
      context.beginPath();
      var endPoint = this.getEndPoint(this.x, this.y);
      context.moveTo(this.x, this.y);
      context.lineTo(endPoint.x, endPoint.y);
      var background = context.createLinearGradient(this.x, this.y, endPoint.x, endPoint.y);
      background.addColorStop(0, this.color);
      var rgbObject = toRGBAColorObject(this.color);
      background.addColorStop(1, 'rgba(' + rgbObject.r + ',' + rgbObject.g + ',' + rgbObject.b + ',0)'); //rgb must be as same as incolor
      context.strokeStyle = background;
      context.lineWidth = this.width;
      context.stroke();
      context.restore();
    };
    return Meteor;
  }

  function CanvasTool(canvas) {
    //适应父元素（无法使用css固定，并且获得宽高即随机数范围）
    var canvasStyle = window.getComputedStyle(canvas.parentNode),
      width = Number.parseInt(canvasStyle.width),
      height = Number.parseInt(canvasStyle.height);
    canvas.width = width;
    canvas.height = height;

    var context = canvas.getContext('2d');

    this.width = width;
    this.height = height;
    this.context = context;
    this.Circle = CircleClassGenerator(context);
    this.Star = StarClassGenerator(context);
    this.Meteor = MeteorClassGenerator(context, width, height);
  }
  exports.CanvasTool = CanvasTool;
})(window);
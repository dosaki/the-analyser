function RandomSVG(options) {

  'use strict';

  var W3URL = "http://www.w3.org/"
  var _constants = {
    SVGNS: W3URL + "2000/svg",
    XMLNS: W3URL + "2000/xmlns/",
    XLINK: W3URL + "1999/"
  }
  var _self = this;
  var _svg;
  var _options;

  _self.getElement = function() {
    return _svg;
  };

  var drawRect = function() {
    return drawShape('rect', {
      x: rand(),
      y: rand(),
      width: rand(1, _options.maxSize*(2/3)),
      height: rand(1, _options.maxSize*(2/3)),
      opacity: Math.random(),
      fill: getRandomColor(),
      stroke: getRandomColor(),
      "stroke-width": rand(0, 3)
    })
  };

  var drawCircle = function() {
    return drawShape('circle', {
      cx: rand(),
      cy: rand(),
      r: rand(1, _options.maxSize/2),
      opacity: Math.random(),
      fill: getRandomColor(),
      stroke: getRandomColor(),
      "stroke-width": rand(0, 3)
    })
  };

  var drawTriangle = function() {
    var x = rand();
    var y = rand();
    var size = Math.floor(_options.max_size*(2/3));
    return drawShape('polygon', {
      points: x + "," + y + " " +
        (x + rand(-size, size)) + "," + y + rand(-size, size) + " " +
        (x + rand(-size, size)) + "," + y + rand(-size, size),
      opacity: Math.random(),
      fill: getRandomColor(),
      stroke: getRandomColor(),
      "stroke-width": rand(0, 3)
    });
  }

  var drawShape = function(shape, props) {
    var shape = document.createElementNS(_constants.SVGNS, shape);

    for (var key in props) {
      if (props.hasOwnProperty(key) && props[key] !== undefined) {
        var value = "";
        if (typeof props[key] === "object") {
          for (var k in props[key]) {
            value += k + ": " + props[key][k] + "; "
          }
        } else {
          value = props[key];
        }
        shape.setAttributeNS(null, key, value);
      }
    }
    return shape;
  };

  var init = function(options) {
    _options = options;
    _options.maxSize = options.maxSize || 300;
    _options.width = _options.maxSize;
    _options.height = _options.maxSize;
    _options.background = options.background || getRandomColor();
    _options.maxCircles = options.maxCircles || Math.floor(_options.maxSize/100);
    _options.maxRectangles = options.maxRectangles || Math.floor(_options.maxSize/100);
    _options.maxTriangles = options.maxTriangles || Math.floor(_options.maxSize/100);

    _svg = document.createElementNS(_constants.SVGNS, 'svg');
    _svg.setAttributeNS(_constants.XMLNS, "xmlns:xlink", _constants.XMLNS);
    _svg.setAttribute('width', _options.width || 100);
    _svg.setAttribute('height', _options.height || 100);
    _svg.setAttribute('viewbox', "0 0 " + _options.width + " " + _options.height);
    _svg.setAttribute('style', 'background-color:' + _options.background + ';');

    var circles = rand(1, _options.maxCircles);
    for (var i = 0; i < circles; i++) {
      _svg.appendChild(drawCircle());
    }

    var rectangles = rand(0, _options.maxRectangles);
    for (var i = 0; i < rectangles; i++) {
      _svg.appendChild(drawRect());
    }

    var triangles = rand(0, _options.maxTriangles);
    for (var i = 0; i < triangles; i++) {
      _svg.appendChild(drawTriangle());
    }
  };

  init(options || {});
}

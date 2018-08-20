function RandomSVG(options) {

  'use strict';

  var W3URL = "http://www.w3.org/";
  var _constants = {
    SVGNS: W3URL + "2000/svg",
    XMLNS: W3URL + "2000/xmlns/",
    XLINK: W3URL + "1999/"
  };
  var _s = this;
  var _svg;
  var _options;

  _s.getElement = function() {
    return _svg;
  };

  var rect = function() {
    return drawShape('rect', {
      x: rand(),
      y: rand(),
      width: rand(1, _options.maxSize*(2/3)),
      height: rand(1, _options.maxSize*(2/3)),
      opacity: Math.random(),
      fill: getRandomColor(),
      stroke: getRandomColor(),
      "stroke-width": rand(0, 3)
    });
  };

  var circle = function() {
    return drawShape('circle', {
      cx: rand(),
      cy: rand(),
      r: rand(1, _options.maxSize/2),
      opacity: Math.random(),
      fill: getRandomColor(),
      stroke: getRandomColor(),
      "stroke-width": rand(0, 3)
    });
  };

  var tria = function() {
    var x = rand();
    var y = rand();
    var size = Math.floor(_options.maxSize*(2/3));
    return drawShape('polygon', {
      points: x + "," + y + " " +
        (x + rand(-size, size)) + "," + (y + rand(-size, size)) + " " +
        (x + rand(-size, size)) + "," + (y + rand(-size, size)),
      opacity: Math.random(),
      fill: getRandomColor(),
      stroke: getRandomColor(),
      "stroke-width": rand(0, 3)
    });
  };

  var drawShape = function(shape, props) {
    var s = document.createElementNS(_constants.SVGNS, shape);

    for (var i in props) {
      if (props.hasOwnProperty(i) && props[i] !== undefined) {
        var value = "";
        if (typeof props[i] === "object") {
          for (var k in props[i]) {
            value += k + ": " + props[i][k] + "; "
          }
        } else {
          value = props[i];
        }
        s.setAttributeNS(null, i, value);
      }
    }
    return s;
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
    _svg.setAttributeNS(_constants.XMLNS, "xmlns:xlink", _constants.XLINK);
    _svg.setAttribute('width', _options.width || 100);
    _svg.setAttribute('height', _options.height || 100);
    _svg.setAttribute('viewbox', "0 0 " + _options.width + " " + _options.height);
    _svg.setAttribute('style', 'background-color:' + _options.background + ';');

    var circles = rand(1, _options.maxCircles);
    for (var i = 0; i < circles; i++) {
      _svg.appendChild(circle());
    }

    var rectangles = rand(0, _options.maxRectangles);
    for (var i = 0; i < rectangles; i++) {
      _svg.appendChild(rect());
    }

    var triangles = rand(0, _options.maxTriangles);
    for (var i = 0; i < triangles; i++) {
      _svg.appendChild(tria());
    }
  };

  init(options || {});
}

(function(window, Snap, mina) {
	'use strict';

	/* shapes, each (-100 < x,y < 100) */
  var SHAPES = [
		"M0,59.172702727031975A59.172702727031975,59.172702727031975 0 1,1 0,-59.172702727031975A59.172702727031975,59.172702727031975 0 1,1 0,59.172702727031975Z",
	  "M-70.35623639735145,-23.45207879911715H-23.45207879911715V-70.35623639735145H23.45207879911715V-23.45207879911715H70.35623639735145V23.45207879911715H23.45207879911715V70.35623639735145H-23.45207879911715V23.45207879911715H-70.35623639735145Z",
	  "M0,-97.60266103764192L56.35092262370636,0 0,97.60266103764192 -56.35092262370636,0Z",
	  "M-52.44044240850758,-52.44044240850758L52.44044240850758,-52.44044240850758 52.44044240850758,52.44044240850758 -52.44044240850758,52.44044240850758Z",
	  "M0,69.01550348156863L79.69223902668242,-69.01550348156863 -79.69223902668242,-69.01550348156863Z",
	  "M0,-69.01550348156863L79.69223902668242,69.01550348156863 -79.69223902668242,69.01550348156863Z"
  ];

	var width, height, paper;

	function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    paper.attr({width: width, height: height});
  }

  function matrix(a, size) {
    var offset = a * (2 * width + 2 * height),
        mtx = Snap.matrix();

    if (offset < width) {
    	mtx.translate(offset, -100*size);
    } else {
		offset -= width;
      if (offset < height) {
        mtx.translate(width+100*size, offset);
      } else {
        offset -= height;
        if (offset < width) {
          mtx.translate(width - offset, height+100*size);
        } else {
          offset -= width;
          mtx.translate(-100*size, height - offset);
        }
      }
    }

		mtx.scale(size);
    return mtx;
  }

  function randomAttributes(i) {
  	var opacity = (0.3 + 0.7*Math.random()),
  	    size = 0.0008 * (width + height) * (1.0 - opacity);

		return {
    	transform: matrix(Math.random(), size),
			strokeWidth: 2/Math.pow(1+size, 3),
      opacity: 1//opacity
    };
  }

  function spawn() {
    var shape = Math.floor(SHAPES.length * Math.random());

		var element = paper.path(SHAPES[shape]);
    element.attr(randomAttributes(true));

		element.animate(randomAttributes(), 5000, function() {
      element.remove();
    });
  }

  paper = Snap("#shapes");
	resize();
  window.addEventListener('resize', resize, false);

	(function loop() {
		setTimeout(loop, 1000);
		Snap.animate(0, 100, function(n) {
			if (Math.round(n) % 10 === 0) {
				spawn();
			}
		}, 1000);
	})();
})(window, Snap, mina);

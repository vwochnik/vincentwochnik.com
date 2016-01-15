(function(doc, _, Two) {
    // Date.now() IE<=8 shim
    if (!Date.now) {
      Date.now = function() { return new Date().getTime(); }
    }

    var root = this,
        canvasElement = doc.getElementById('cover-canvas'),
        two = new Two({ domElement: canvasElement }),
        colors = canvasElement.dataset.colors.split(/,\s*/),
        numberOfSegments = parseInt(canvasElement.dataset.segments),
        drawingOpacity = parseFloat(canvasElement.dataset.opacity),
        segments = [];

    function segmentCircle(two, size, layer, parts, colors, opacity) {
      var group;

      var init = function() {
        var thickness = size / 12.0 / Math.pow(layer + 3, 0.9);
        var radius = size / 12.0 * Math.pow(layer + 3.5, 0.85);

        var sum = 0, offset = 0;
        var arcs = _.chain(parts*2)
         .times(function() {
          var val = 0.2+Math.random();
          sum += val;
          return val;
         })
         .map(function(val) {
          return val / sum;
         })
         .groupBy(function(elem, i) {
          return Math.floor(i/2);
         })
         .map(function(pair) {
          var start = (offset += pair[0]);
          var end = start + pair[0];
          offset += pair[1];

          return {
            sa: start * 2.0*Math.PI,
            se: end * 2.0*Math.PI,
            s: Math.min(3, Math.floor(360 * length))
          };
         })
         .map(function(p) {
          var arc = new Two.ArcSegment(0, 0, radius - thickness, radius, p.sa, p.se, p.s);
          arc.fill = colors[_.random(0, colors.length-1)];
          arc.opacity = opacity;
          return arc;
         })
         .value();

        this.group = two.makeGroup(arcs);
        this.group.translation.set(two.width / 2, two.height / 2);
        this.group.scale = Math.min(two.width, two.height) / size;
      };

      var update = function(delta) {
        this.group.rotation += delta/500.0/(1+layer);
      };

      var resize = function() {
        this.group.translation.set(two.width / 2, two.height / 2);
        this.group.scale = Math.min(two.width, two.height) / size;
      };

      return {
        init: init,
        update: update,
        resize: resize
      };
    }

    var fitted = _.bind(function() {
      var wr = document.getElementById('cover').getBoundingClientRect();
      var width = this.width = wr.width;
      var height = this.height = wr.height;

      this.renderer.setSize(width, height, this.ratio);
      this.trigger(Two.Events.resize, width, height);
    }, two);

    if (_.isFunction(root.addEventListener))
      root.addEventListener('resize', fitted);
    else
      root.attachEvent('onresize', fitted);
    fitted();

    _.times(numberOfSegments, function(i) {
      var segment = segmentCircle(two, 960, i, Math.pow(i+2, 2), colors, drawingOpacity);
      segment.init();
      segments.push(segment);
    });
    two.update();

    var lastTime = Date.now(), time, delta;
    two.bind('update', function(frameCount) {
      time = Date.now();
      delta = time - lastTime;
      lastTime = time;

      _.each(segments, function(segment) {
        segment.update(delta);
      });
    }).play();

    two.bind('resize', function() {
      _.each(segments, function(segment) {
        segment.resize();
      });
      two.update();
    });
})(document, _, Two);

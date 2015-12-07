(function(doc, _, Two) {
    // Date.now() IE<=8 shim
    if (!Date.now) {
      Date.now = function() { return new Date().getTime(); }
    }

    var root = this,
        two = new Two({ domElement: doc.getElementById('cover-canvas') }),
        segments = [];

    function segmentCircle(two, size, layer, parts, color, opacity) {
      var group;

      var pattern = function() {
        var sum = 0;
        ary = _.times(parts*2, function() {
          var val = Math.random();
          sum += val;
          return val;
        });

        return _.map(ary, function(val) {
          return val / sum;
        });
      };

      var params = function(frameCount) {
        var ary = [];
        var thickness = size / 12.0 / Math.pow(layer + 2, 0.9);
        var radius = size / 12.0 * Math.pow(layer + 3.5, 0.8);

        var pattern = this.pattern();
        var offset = 0;
        return _.times(parts, function() {
          var length = pattern.pop();
          var start = (offset += length);
          var end = start + length;
          offset += pattern.pop();

          return {
            ir: radius - thickness,
            or: radius,
            sa: start * 2.0*Math.PI,
            se: end * 2.0*Math.PI,
            s: Math.min(3, Math.floor(360 * length))
          };
        });
      };

      var init = function() {
        var arcs = _.map(this.params(), function(p) {
          var arc = new Two.ArcSegment(0, 0, p.ir, p.or, p.sa, p.se, p.s);
          arc.fill = color;
          arc.opacity = 0.2;
          return arc;
        });

        // add them to a group
        this.group = two.makeGroup(arcs);
        this.group.translation.set(two.width / 2, two.height / 2);
        this.group.scale = Math.min(two.width, two.height) / size;
      };

      var update = function(delta) {
        console.log(delta);
        this.group.rotation += delta/500.0/(1+layer);
      };

      var resize = function() {
        this.group.translation.set(two.width / 2, two.height / 2);
        this.group.scale = Math.min(two.width, two.height) / size;
      };

      return {
        group: group,
        pattern: pattern,
        params: params,
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

    _.times(6, function(i) {
      var segment = segmentCircle(two, 960, i, Math.pow(i+2, 2), '#00c0ff', 0.3);
      segments.push(segment);
      segment.init();
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
})(
  document,
  typeof require === 'function' ? require('underscore') : _,
  typeof require === 'function' ? require('two.js') : Two
);

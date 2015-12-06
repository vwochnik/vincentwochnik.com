(function(doc, _, Two) {

    var root = this,
        two = new Two({ domElement: doc.getElementById('cover-canvas') }),
        segments = [];

    function segmentCircle(two, radius, thickness, parts, color, opacity) {
      var params = function(frameCount) {
        var ary = [];
        for (var i = 0; i < parts; i++) {
          var d = 360.0 / parts;
          var s = i * d;
          ary.push({
            cx: two.width / 2.0,
            cy: two.height / 2.0,
            ir: radius - thickness / 2.0,
            or: radius + thickness / 2.0,
            sa: s / 180.0 * Math.PI,
            se: (s+d) / 180.0 * Math.PI,
            s: s,
            opacity: i/parts
          });
        }
        return ary;
      };

      var makeArcs = function(frameCount) {
        var that = this;
        _.each(this.params(frameCount), function(p) {
          that.makeArc(p);
        });
      };

      var makeArc = function(p) {
        var arc = two.makeArcSegment(p.cx, p.cy, p.ir, p.or, p.sa, p.se, p.s);
        arc.fill = color;
        arc.opacity = p.opacity;
        return arc;
      };

      return {
        params: params,
        makeArcs: makeArcs,
        makeArc: makeArc,
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

    segments.push(segmentCircle(two, 100, 50, 2, '#00c0ff', 0.3));
    segments.push(segmentCircle(two, 200, 50, 4, '#00c0ff', 0.2));
    _.each(segments, function(segment) {
      segment.makeArcs(0);
    });
    two.update();

    two.bind('update', function(frameCount) {
      two.clear();
      _.each(segments, function(segment) {
        segment.makeArcs(frameCount);
      });
    }).play();
})(
  document,
  typeof require === 'function' ? require('underscore') : _,
  typeof require === 'function' ? require('two.js') : Two
);

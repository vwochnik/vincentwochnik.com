(function($, wnd) {
  'use strict';

  var elems = [];
  var lastHeight = $(wnd).height();

  function eventHandler() {
    var height, last = $(wnd).height(), adjusted;

    for (var n = 0; n < elems.length; n++) {
      if ((height = elems[n](last)) > last) {
        last = height;
        n = -1;
      }
    }

    adjustScroll(lastHeight - last);
    lastHeight = last;
  }

  function adjustScroll(delta) {
    var top;

    if ((top = $(wnd).scrollTop()) > 0)
      $(wnd).scrollTop(Math.max(0, top - delta));
  }

  $.fn.viewportAdjust = function(fn) {
    this.each(function() {
      var index, height;

      if (elems.length === 0)
        $(wnd).on('resize.viewportAdjust', eventHandler);

      var elem = this;
      elems.push(function(height) { fn(elem, height); });
      eventHandler();
    });

    return this;
  };
})(jQuery, window);

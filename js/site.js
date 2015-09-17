(function($, wnd) {
  $(function() {
    /* adjust height */
    $('.viewport-adjust').viewportAdjust(function(elem, height) {
      return $(elem).height(height).height();
    });
  });
})(jQuery, window);

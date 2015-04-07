(function($, wnd) {
  $(function() {
    $('.navbar-toggle').click(function() {
      $('.navbar').toggleClass('toggled');
    });

    /* adjust height */
    $('.viewport-adjust-height').viewportAdjust(function(elem, height) {
      return $(elem).height(height).height();
    });
    $('.viewport-adjust-height-half').viewportAdjust(function(elem, height) {
      return $(elem).height(height / 2.0).height() * 2.0;
    });

    /* adjust logo clip */
    $('.logo-clip-inside.viewport-adjust-clip-height').viewportAdjust(function(elem, height) {
      var rect = '(0 '+$(wnd).width()+'px '+height+'px 0)';
      $(elem).css({'clip': 'rect'+rect, 'clip-path': 'inset'+rect});
      return height;
    });
    $('.logo-clip-inside.viewport-adjust-clip-height-half').viewportAdjust(function(elem, height) {
      var rect = '(0 '+$(wnd).width()+'px '+(height / 2.0)+'px 0)';
      $(elem).css({'clip': 'rect'+rect, 'clip-path': 'inset'+rect});
      return height;
    });
  });
})(jQuery, window);

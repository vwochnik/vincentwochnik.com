(function($, wnd) {
  function toggleOverlay() {
    var visible = !$('#menu').hasClass('visible');
    $('#menu').toggleClass('fade-out', !visible);
    $('#menu').toggleClass('visible', visible);
    $('.menu-button').toggleClass('active', visible);
  }

  $(function() {
    $('#menu').click(function(e) {
      if (e.target.nodeName !== 'A') {
        toggleOverlay();
        return false;
      }
    });

    $('.menu-button').click(function(e) {
      toggleOverlay();
      return false;
    });
  });
})(jQuery, window);

(function($, wnd) {
  function toggleOverlay() {
    var visible = !$('#menu').hasClass('visible');
    $('#menu').toggleClass('fade-out', !visible);
    $('#menu').toggleClass('visible', visible);
    $('.menu-button').toggleClass('active', visible);
  }

  $(function() {
    $('#typing').typing({
      sourceElement: $('.typing-content')
    });

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

    /* arrow down scroll */
    $('a.animated-scroll').each(function() {
      var $this = $(this)
          $root = $('html, body'),
          href = $this.attr('href');

        $this.click(function() {
          $root.animate({ scrollTop: $(href).offset().top }, 500,
            function() { wnd.location.hash = href; });
          return false;
        });
    });
  });
})(jQuery, window);

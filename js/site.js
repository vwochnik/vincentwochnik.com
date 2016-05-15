(function($, wnd) {
  function toggleOverlay() {
    if ($('#qr-code-overlay').hasClass('visible'))
      $('#qr-code-overlay').addClass('fade-out').removeClass('visible');
    else
      $('#qr-code-overlay').removeClass('fade-out').addClass('visible');
  }

  $(function() {
    $('#typing').typing({
      sourceElement: $('#cover .typing-content')
    });

    $('#qr-code-overlay').click(function(e) {
      if (e.target.nodeName !== 'A') {
        toggleOverlay();
        return false;
      }
    });

    $('#qr-code-link').click(function(e) {
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

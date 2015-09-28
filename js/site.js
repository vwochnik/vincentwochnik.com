(function($, wnd) {
  $(function() {
    /* adjust cover height */
    $('.viewport-adjust').viewportAdjust(function(elem, height) {
      return $(elem).height(height).height();
    });

    $('#qr-code-link, #qr-code-overlay').click(function() {
      if ($('#qr-code-overlay').hasClass('visible'))
        $('#qr-code-overlay').addClass('fade-out').removeClass('visible');
      else
        $('#qr-code-overlay').removeClass('fade-out').addClass('visible');
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

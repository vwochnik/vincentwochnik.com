/*!
 * vincentwochnik.com contact form script
 * Copyright 2015 Vincent Wochnik. All rights reserved.
 */

(function($) {
    var $form, $messages;
    var processing = false;

    function showMessage(cls, clear) {
      $messages.children().hide();
      $('.'+cls, $messages).show();
      $messages.removeClass('fade-out').addClass('visible');
      $form.addClass('with-messages');

      if (clear) {
        setTimeout(function() {
          $messages.addClass('fade-out').removeClass('visible');
          $form.removeClass('with-messages');
        }, 5000);
      }
    }

    function submitData(data, next) {
      $.ajax({
        url: '//vwchnkcom.herokuapp.com/mail',
        method: 'POST',
        data: JSON.stringify(data),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }).done(function(data) {
        next(!!data.success);
      }).fail(function() {
        next(false);
      });
    }

    $(function() {
      $form = $("#contact-form");
      $messages = $("#contact-messages");

      $form.submit(function(e) {
        e.preventDefault();

        if (processing) {
          return false;
        }

        $('[type="submit"]', $form).prop('disabled', true);
        processing = true;

        var data = {};
        $.each($form.serializeArray(), function(idx, item) { data[item.name] = item.value; });

        showMessage('contact-message-processing', false);

        submitData(data, function(success) {
          if (success) {
            $form.trigger('reset');
            showMessage('contact-message-sent', true);
          } else {
            showMessage('contact-message-send-failed', true);
          }

          $('[type="submit"]', $form).prop('disabled', false);
          processing = false;
        });
        return false;
      });
    });
})(jQuery);

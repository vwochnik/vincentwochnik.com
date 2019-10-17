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

    function submitData(form_data, next) {
      if (processing) {
        next(false);
        return;
      }

      var json_data = {};
      for (var fkey in form_data) {
        if (form_data.hasOwnProperty(fkey)) {
          json_data[fkey] = form_data[fkey];
        }
      }

      processing = true;
      $.ajax({
        url: '//vwchnkcom.herokuapp.com/mail',
        method: 'POST',
        data: json_data,
        dataType: 'json',
        headers: {
          'Accept': 'application/json'
        }
      }).done(function(data) {
        processing = false;
        next(!data.success);
      }).fail(function() {
        processing = false;
        next(false);
      });
    }

    $(function() {
      $form = $("#contact-form");
      $messages = $("#contact-messages");

      $form.submit(function(e) {
        var data = {};
        $.each($form.serializeArray(), function(idx, item) { data[item.name] = item.value; });

        $('[type="submit"]', $form).prop('disabled', true);
        submitData(data, function(success) {
          if (success) {
            showMessage('contact-message-sent', true);
          } else {
            showMessage('contact-message-send-failed', true);
          }
          $form.trigger('reset');
          $('[type="submit"]', $form).prop('disabled', false);
        });
        e.preventDefault();
        return false;
      });
    });
})(jQuery);

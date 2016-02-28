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
          json_data['_'+fkey] = form_data[fkey];
        }
      }

      processing = true;
      $.ajax({
        url: '//formspree.io/%76%69%6E%63%65%6E%74@%76%69%6E%63%65%6E%74%77%6F%63%68%6E%69%6B.%63%6F%6D',
        method: 'POST',
        data: json_data,
        dataType: 'json'
      }).done(function(data) {
        processing = false;
        next((typeof data.success !== 'undefined') ? true : false);
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

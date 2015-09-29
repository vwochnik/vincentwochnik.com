/*!
 * vincentwochnik.com contact form script
 * Copyright 2015 Vincent Wochnik. All rights reserved.
 */

(function($) {
    var $form, $messages;
    var ticket = null, processing = false, timeout = null;

    function showMessage(msg, error, clear) {
      var $span = $('<span/>').addClass('contact-message').append(msg);
      $span.addClass(error ? 'contact-message-error' : 'contact-message-success');
      $messages.empty().removeClass('fade-out').addClass('visible').append($span);
      $form.addClass('with-messages');

      if (clear) {
        setTimeout(function() {
          $messages.addClass('fade-out').removeClass('visible');
          $form.removeClass('with-messages');
        }, 5000);
      }
    }

    function needTicket() {
      return ((!ticket) || ((ticket.expires) && (new Date(ticket.expires) < new Date())));
    }

    function getTicket(next) {
        if (processing) {
          next(false);
          return;
        }

        processing = true;
        $.ajax({
          url: "/ajax/contact.php",
          type: 'get',
          dataType: 'json'
        }).done(function(data) {
          processing = false;
          if (data.secret) {
            ticket = data;
            next(true);
          } else {
            next(false);
          }
        }).fail(function() {
          processing = false;
          next(false);
        });
    }

    function ticketRecursive(tries) {
      if (timeout !== null) {
        clearTimeout(timeout);
        timeout = null;
      }

      if (processing) {
        setTimeout(function() { ticketRecursive(3); }, 10000);
        return;
      }

      if (tries > 0) {
        getTicket(function(success) {
          if (success) {
            timeout = setTimeout(function() { ticketRecursive(3); }, (ticket.expires - new Date()).getTime());
            showMessage('Ticket received successfully. You can now submit a message.', false, true);
          } else {
            ticketRecursive(tries - 1);
          }
        });
      } else {
        showMessage('Ticket could not be received.', true, false);
      }
    }

    function submitData(name, email, subject, message, next) {
      if ((processing) || (needTicket())) {
        next(false);
        return;
      }

      processing = true;
      $.ajax({
        url: "/ajax/contact.php",
        type: 'post',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({ name: name, email: email, subject: subject, message: message, secret: ticket.secret })
      }).done(function(data) {
        processing = false;
        if (data.success) {
          next(true, data.success);
        } else if (data.error) {
          next(false, data.error);
        } else {
          next(false);
        }
      }).fail(function() {
        processing = false;
        next(false);
      });
    }

    $(function() {
      $form = $("#contact-form");
      $messages = $("#contact-messages");

      $("#contact-submit").click(function(e) {
        submitData($("#contact-name").val(), $("#contact-email").val(), $("#contact-subject").val(), $("#contact-message").val(), function(success) {
          if (success) {
            showMessage('Thank you! Your message has been submitted successfully.', false, true);
          } else {
            showMessage('Your message could not be submitted. Please try again later.', true, false);
          }
        });
        e.preventDefault();
        return false;
      });

      ticketRecursive(3);
    });
})(jQuery);

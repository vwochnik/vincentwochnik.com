/*!
 * VincentWochnik.com Contact Form
 * Copyright 2014 Vincent Wochnik. All rights reserved.
 */

(function($) {
    var $form = $("#contact-form"),
        $messages = $("#contact-messages");
    var ticket = null, processing = false, fails = 0, timeout = null;

    function showMessage(msg, cls, next) {
        var $span = $('<span class="'+cls+'"/>').append(msg);
        $messages.empty().removeClass('fade-out').addClass('visible').append($span);
        $form.addClass('with-messages');
        setTimeout(function() {
            $messages.addClass('fade-out').removeClass('visible');
            $form.removeClass('with-messages');
            if (next) next();
        }, 5000);
    }

    function needTicket() {
        if (!ticket)
            return true;
        if ((ticket.expires) && (new Date(ticket.expires) < new Date()))
            return true;
        return false;
    }

    function getTicket() {
        if (processing) {
          return false;
        }

        if (timeout !== null) {
            clearTimeout(timeout);
            timeout = null;
        }
        $.ajax({
            url: "/ajax/contact.php",
            type: 'get',
            dataType: 'json',
            error: function() {
                fails++;
                if (fails < 3) {
                  timeout = setTimeout(getTicket, 6000);
                }
            },
            success: function(data) {
                fails = 0;
                ticket = data;
                if (ticket.expires) {
                    timeout = setTimeout(getTicket,
                               new Date(ticket.expires) - new Date());
                }
            }
        });
    }

    $(function() {
        $("#contact-submit").click(function(e) {
            if (submitting)
                return false;
            if (needTicket()) {
                formResult("Unable to submit data.", "text-danger");
                return false;
            }
            submitting = true;

            var data = {
                name: $("#contact-name").val(),
                email: $("#contact-email").val(),
                subject: $("#contact-subject").val(),
                message: $("#contact-message").val(),
                secret: ticket.secret
            };

            $.ajax({
                url: "/ajax/contact.php",
                type: 'post',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify(data),
                error: function() {
                    formResult("Unable to submit data.", "text-danger");
                    submitting = false;
                    getTicket();
                },
                success: function(data) {
                    if (data.success) {
                        formResult(data.success, "text-success");
                        $form.trigger("reset");
                    } else if (data.error) {
                        formResult(data.error, "text-danger");
                    } else {
                        formResult("Internal error.", "text-danger");
                    }
                    submitting = false;
                    getTicket();
                }
            });

            return false;
        });

        // start getting tickets
        getTicket();
    });
})(jQuery);

(function () {
    var form = $('#confirmForm');
    var errBox = form.find('#error-box');
    var sendButton = form.find('#confirm-code-button');
    var checkButton = form.find('#confirm-check-button');

    sendButton.click(function () {
        sendButton.attr('disabled', true);
        sendButton.html('Sending Code...');
        $.post('/auth/mail-confirm')
            .done(function (err, res) {
                errBox.text('Confirmation Code Sent!');
            })
            .error(function (result, status) {
                console.log(result);
                errBox.text('Connection Failed');
            })
            .always(function () {
                sendButton.html('Resend Code!');
                sendButton.attr('disabled', false);
            });
    });

    form.validate({
        submitHandler: function () {
            checkButton.attr('disabled', true);
            checkButton.html('Checking...');
            $.post('/auth/confirm', form.serialize())
                .done(function (result, status, jqXHR) {
                    if (result === 'OK') {
                        hideForm();
                        window.location.reload();
                        alert("Email account verified");
                    } else {
                        errBox.text(result);
                    }
                })
                .error(function (result, status) {
                    console.log(result);
                    errBox.text('Connection Failed');
                })
                .always(function () {
                    checkButton.html('Check');
                    checkButton.attr('disabled', false);
                });
        },
        errorPlacement: function (error, element) {
            errBox.html(error);
        },
        rules: {
            code: {
                required: true
            }
        },
        messages: {
            code: {
                required: "The confirmation is required"
            }
        }
    });
})();
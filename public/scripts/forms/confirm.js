(function () {
    var form = $('#confirmForm');
    var errBox = form.find('#error-box');
    var sendButton = form.find('#confirm-code-button');
    var checkButton = form.find('#confirm-check-button');

    sendButton.click(function () {
        submitPostRequest(form, '/auth/mail-confirm', function () {
            errBox.text('Confirmation Code Sent!');
        }, 'Sending Code...', sendButton);
    });

    form.validate({
        submitHandler: function () {
            submitPostRequest(form, '/auth/confirm', function () {
                hideForm();
                loadNavBar();
            }, "Checking...", checkButton);
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
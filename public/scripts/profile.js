(function () {
    var form = $('#profileForm');
    var errBox = form.find('#error-box');
    var submitButton = form.find('#submit-button');
    form.validate({
        submitHandler: function () {
            submitButton.text('Saved...');
            submitButton.attr('disabled', true);
            $.post('/user/update-user', form.serialize())
                .done(function (result, status, jqXHR) {
                    if (result === 'OK') {
                        errBox.html('<b>Saved!</b>');
                        reloadPage();
                    } else {
                        errBox.text(result);
                    }
                })
                .error(function (result, status) {
                    console.log(result.responseText);
                    errBox.text('Connection Failed');
                })
                .always(function () {
                    submitButton.text('Save');
                    submitButton.attr('disabled', false);
                });
        },
        errorPlacement: function (error, element) {
            errBox.html(error);
        },
        rules: {
            name: {
                required: true,
                minlength: 4,
                maxlength: 60
            },
            email: {
                required: true,
                email: true
            }
        },
        messages: {
            uname: {
                required: "The username is required",
                minlength: "Username should be at least 4 characters long",
                maxlength: "Username should not have more than 60 characters"
            },
            email: "Please enter a valid email address"
        }
    });
})();
(function () {
    var form = $('#loginForm');
    var errBox = form.find('#error-box');
    var submitButton = form.find(':submit');

    form.validate({
        submitHandler: function () {
            $.post('/auth/login', form.serialize())
                .done(function (result, status, jqXHR) {
                    if (result) errBox.text(result);
                    else window.location.href = '/';
                })
                .error(function (result, status) {
                    console.log(result);
                    errBox.text('Connection Failed');
                })
                .always(function () {
                    submitButton.attr('disabled', false);
                });
        },
        errorPlacement: function (error, element) {
            errBox.text(error.text());
        },
        rules: {
            uname: {
                required: true,
                minlength: 3,
                maxlength: 35
            },
            passwd: {
                required: true,
                minlength: 5,
                maxlength: 25
            }
        },
        messages: {
            uname: {
                required: "The username is required",
                minlength: "Username should be at least 3 characters long",
                maxlength: "Username should not have more than 35 characters"
            },
            passwd: {
                required: "The password is required",
                minlength: "Password should have at least 6 characters",
                maxlength: "Password should not have more than 25 characters"
            }
        }
    });
})();
(function () {
    var form = $('#registerForm');
    var errBox = form.find('#error-box');
    var submitButton = form.find('#signup-button');

    form.validate({
        submitHandler: function () {
            submitButton.text('Submitting...');
            submitButton.attr('disabled', true);
            $.post('/auth/register', form.serialize())
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
            errBox.show(error);
        },
        rules: {
            uname: {
                required: true,
                minlength: 3,
                maxlength: 35
            },
            email: {
                required: true,
                email: true
            },
            password: {
                required: true,
                minlength: 5,
                maxlength: 25
            },
            passwd: {
                required: true,
                minlength: 5,
                maxlength: 25,
                equalTo: "#password"
            },
            agree: "required"
        },
        messages: {
            uname: {
                required: "The username is required",
                minlength: "Username should be at least 3 characters long",
                maxlength: "Username should not have more than 35 characters"
            },
            password: {
                required: "The password is required",
                minlength: "Password should have at least 5 characters",
                maxlength: "Password should not have more than 25 characters"
            },
            passwd: {
                required: "The confirmation is required",
                minlength: "Password should have at least 5 characters",
                maxlength: "Password should not have more than 25 characters",
                equalTo: "Please enter the same password as above"
            },
            email: "Please enter a valid email address",
            agree: "Please agree with our terms and services"
        }
    });
})();
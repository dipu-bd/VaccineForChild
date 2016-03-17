(function () {
    var form = $('#changePassForm');
    var errBox = form.find('#error-box');
    var submitButton = form.find(':submit');

    form.validate({
        submitHandler: function () {
            submitButton.attr('disabled', true);
            $.post('/auth/change-pass', form.serialize())
                .done(function (result, status, jqXHR) {
                    if (result === 'OK') {
                        hideForm();
                        alert("Password Changed");
                    } else {
                        errBox.text(result);
                    }
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
            errBox.html(error);
        },
        rules: {
            old: {
                required: true,
                minlength: 5,
                maxlength: 25
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
            }
        },
        messages: {
            old: {
                required: "The old password is required",
                minlength: "Password should have at least 5 characters",
                maxlength: "Password should not have more than 25 characters"
            },
            password: {
                required: "The new password is required",
                minlength: "Password should have at least 5 characters",
                maxlength: "Password should not have more than 25 characters"
            },
            passwd: {
                required: "The confirmation is required",
                minlength: "Password should have at least 5 characters",
                maxlength: "Password should not have more than 25 characters",
                equalTo: "Please enter the same password as above"
            }
        }
    });
})();
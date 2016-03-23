(function () {
    var form = $('#changePassForm');

    form.validate({
        submitHandler: function () {
            submitPostRequest(form, '/auth/change-pass', function () {
                hideForm();
            });
        },
        rules: {
            old: {
                required: true,
                minlength: 4,
                maxlength: 25
            },
            password: {
                required: true,
                minlength: 4,
                maxlength: 25
            },
            passwd: {
                required: true,
                minlength: 4,
                maxlength: 25,
                equalTo: "#password"
            }
        },
        messages: {
            old: {
                required: "The old password is required",
                minlength: "Password should have at least 4 characters",
                maxlength: "Password should not have more than 25 characters"
            },
            password: {
                required: "The new password is required",
                minlength: "Password should have at least 4 characters",
                maxlength: "Password should not have more than 25 characters"
            },
            passwd: {
                required: "The confirmation is required",
                minlength: "Password should have at least 4 characters",
                maxlength: "Password should not have more than 25 characters",
                equalTo: "Please enter the same password as above"
            }
        }
    });
})();
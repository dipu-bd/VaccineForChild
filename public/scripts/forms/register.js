(function () {
    var form = $('#registerForm');
    var errBox = form.find('#error-box');
    form.validate({
        submitHandler: function () {
            submitPostRequest(form, '/auth/register', function () {
                window.location.hash = 'profile';
                reloadPage();
            });
        },
        errorPlacement: function (error, element) {
            errBox.text(error.text());
        },
        rules: {
            name: {
                required: true,
                minlength: 3,
                maxlength: 60
            },
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
                minlength: 4,
                maxlength: 25
            },
            passwd: {
                required: true,
                minlength: 4,
                maxlength: 25,
                equalTo: "#password"
            },
            agree: "required"
        },
        messages: {
            name: {
                required: "Please give us your original full name",
                minlength: "Name should be at least 3 characters long",
                maxlength: "Name should not have more than 35 characters"
            },
            uname: {
                required: "The username is required",
                minlength: "Username should be at least 3 characters long",
                maxlength: "Username should not have more than 35 characters"
            },
            password: {
                required: "The password is required",
                minlength: "Password should have at least 4 characters",
                maxlength: "Password should not have more than 25 characters"
            },
            passwd: {
                required: "The confirmation is required",
                minlength: "Password should have at least 4 characters",
                maxlength: "Password should not have more than 25 characters",
                equalTo: "Please enter the same password as above"
            },
            email: "Please enter a valid email address",
            agree: "Please agree with our terms and services"
        }
    });
})();
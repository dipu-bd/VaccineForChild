(function () {
    var form = $('#profileForm');
    var errBox = form.find('#error-box');
    form.validate({
        submitHandler: function () {
            submitPostRequest(form, '/user/update-user', function () {
                reloadPage();
                errBox.html('Saved!');
            });
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
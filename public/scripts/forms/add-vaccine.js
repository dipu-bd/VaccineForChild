(function () {
    var form = $('#addVaccine');

    form.validate({
        submitHandler: function () {
            submitPostRequest(form, '/admin/add-vaccine', function () {
                window.location.href = '/';
            });
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
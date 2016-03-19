(function () {
    var form = $('#profileForm');
    var errBox = form.find('#error-box');

    loadData();

    function loadData() {
        $.get('/user-data').done(function (data) {
            if (data) {
                showUserData(data);
            }
        });
    }

    function showUserData(data) {
        form.find('input[name="uname"]').val(data.uname);
        form.find('input[name="email"]').val(data.email);
        form.find('input[name="name"]').val(data.name);
        form.find('input[name="phone"]').val(data.phone);
        form.find('textarea[name="address"]').val(data.address);
        $('#profile-header-display').text(data.uname + " (" + data.email + ")");
    }

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
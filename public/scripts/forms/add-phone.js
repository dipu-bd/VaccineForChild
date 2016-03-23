(function () {
    var form = $('#addPhoneForm');
    var errBox = form.find('#error-box');
    var addPhone = form.find('#add-phone-div');
    var setPhoneButton = form.find('#set-phone-button');
    var verifyPhone = form.find('#verify-phone-div');
    var verifyPhoneButton = form.find('#verify-phone-button');

    // hide verify
    verifyPhone.addClass('hidden');

    function showVerify() {
        verifyPhone.removeClass('hidden');
        addPhone.addClass('hidden');
    }

    setPhoneButton.on('click', function () {
        // check validity
        var input = addPhone.find('input[name="phone"]');
        var phone = input.val();
        if (phone.length < 3 || phone.length > 19) {
            errBox.html("Please provide a valid phone number");
            return;
        }

        // add country code if necessary
        if (phone.substr(0, 4) != '+880') {
            input.val("+880" + phone);
        }

        // submit if everything is okay
        submitPostRequest(form, '/user/set-phone', function success() {
            showVerify();
            errBox.html("Code sent to your phone.");
        }, null, setPhoneButton, function failed() {
            input.val(phone); // to remove added country code
        });
    });

    verifyPhoneButton.on('click', function () {
        submitPostRequest(form, '/user/add-phone', function () {
            hideForm();
        }, null, verifyPhoneButton);
    });


})();
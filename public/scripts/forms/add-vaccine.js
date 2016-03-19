(function () {
        var form = $('#addVaccineForm');
        var addMode = (window.location.hash.substr(0, 4) == '#add');

        deserializeParam();

        function deserializeParam() {
            // set default values
            var data = getDataFromUrl();
            if (data) {
                Object.keys(data).forEach(function (key) {
                    var elem = form.find('input[name="' + key + '"]');
                    if (elem) elem.val(data[key]);
                });
                // set other elements value
                if (!addMode) form.find(':submit').val('Save');
            }
        }


        form.validate({
            submitHandler: function () {
                if (addMode) {
                    // send post request to add
                    submitPostRequest(form, '/admin/add-vaccine', function () {
                        hideForm();
                    });
                } else {
                    // send post request to update
                    submitPostRequest(form, '/admin/update-vaccine', function () {
                        hideForm();
                    });
                }
            },
            rules: {
                title: {
                    required: true,
                    maxlength: 30
                }
            },
            messages: {
                title: {
                    required: "Please provide a title of the vaccine",
                    maxlength: "Title should not be more than 30 characters long"
                }
            }
        });
    })();

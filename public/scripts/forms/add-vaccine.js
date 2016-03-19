(function () {
    var form = $('#addVaccineForm');
    var addMode = (window.location.hash == '#add-dose');

    deserializeParam();

    function deserializeParam() {
        if (addMode) return;
        // set default values
        var data = getDataFromUrl();
        Object.keys(data).forEach(function (key) {
            var elem = form.find('input[name="' + key + '"]');
            if (elem) elem.val(data[key]);
        });
        // other elements
        var modalTitle = $('#access-modal').find('.modal-title');
        var submitButton = form.find(':submit');
        // set other elements value
        modalTitle.text('Edit Vaccine');
        submitButton.val('Save');
    }

    // Read a page's GET URL variables and return them as an associative array.
    function getDataFromUrl() {
        var search = (window.location.hash.match(/\?.*/g) || ["?"])[0];
        return JSON.parse(decodeURIComponent(search.slice(1)));
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
                submitPostRequest(form, '/admin/update-child', function () {
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

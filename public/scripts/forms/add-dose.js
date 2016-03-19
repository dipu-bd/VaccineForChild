(function () {
    var form = $('#addDoseForm');
    var addMode = (window.location.hash.substr(0, 4) == '#add');

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
        form.find(':submit').val('Save');
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
                submitPostRequest(form, '/admin/add-dose', function () {
                    hideForm();
                });
            } else {
                // send post request to update
                submitPostRequest(form, '/admin/update-dose', function () {
                    hideForm();
                });
            }
        },
        rules: {
            name: {
                required: true,
                maxlength: 20
            }
        },
        messages: {
            name: {
                required: "Please provide a name for the dose",
                maxlength: "Name should not be more than 20 characters long"
            }
        }
    });
})();

(function () {
    var form = $('#addChildForm');
    var addMode = (window.location.hash == '#add-child');
    var year = form.find('select[name="year"]');
    var month = form.find('select[name="month"]');
    var day = form.find('select[name="day"]');

    var monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    // load values
    setYears();
    setMonths();
    setDates(1);
    setBirthDay(new Date());
    deserializeParam();

    // attach events
    month.on('change', function () {
        setDates(month.val(), year.val());
    });
    year.on('change', function () {
        setDates(month.val(), year.val());
    });


    function setDates(mon, year) {
        var max = monthDays[mon];
        if (year && mon == 1 && year % 4 == 0) ++max;
        day.html('');
        for (var d = 1; d <= max; ++d) {
            day.append('<option value="' + d + '">' + d + '</option>');
        }
    }

    function setMonths() {
        month.html('');
        for (var m = 0; m < 12; ++m) {
            month.append('<option value="' + m + '">' + monthNames[m] + '</option>');
        }
    }

    function setYears() {
        year.html('');
        var cur = (new Date()).getFullYear();
        for (var y = 0; y <= 20; ++y, --cur) {
            year.append('<option value="' + cur + '">' + cur + '</option>');
        }
    }

    function setBirthDay(date) {
        year.val(date.getFullYear());
        month.val(date.getMonth());
        day.val(date.getDate());
    }

    function deserializeParam() {
        if (addMode) return;
        // set default values
        var child = getChildFromUrl();
        Object.keys(child).forEach(function (key) {
            var elem = form.find('input[name="' + key + '"]');
            if (elem) elem.val(child[key]);
        });
        // other elements
        var modalTitle = $('#access-modal').find('.modal-title');
        var gender = form.find('select[name="gender"]');
        var submitButton = form.find(':submit');
        // set other elements value
        modalTitle.text('Edit Child');
        gender.val(child.gender);
        setBirthDay(new Date(child.dob));
        submitButton.val('Save');
    }

    // Read a page's GET URL variables and return them as an associative array.
    function getChildFromUrl() {
        var search = (window.location.hash.match(/\?.*/g) || ["?"])[0];
        return JSON.parse(decodeURIComponent(search.slice(1)));
    }

    form.validate({
        submitHandler: function () {
            if (addMode) {
                // send add-child request
                submitPostRequest(form, '/user/add-child', function () {
                    hideForm();
                });
            } else {
                // send post request
                submitPostRequest(form, '/user/update-child', function () {
                    hideForm();
                });
            }
        },
        rules: {
            name: {
                required: true,
                maxlength: 60
            },
            gender: {
                required: true
            },
            year: {
                required: true
            },
            month: {
                required: true
            },
            day: {
                required: true
            }
        },
        messages: {
            name: {
                required: "Please provide a name of the child",
                maxlength: "Name should not be more than 60 characters long"
            },
            gender: {
                required: "Please select the gender of the child"
            },
            year: {
                required: "Please select the year of birth"
            },
            month: {
                required: "Please select the month of birth"
            },
            day: {
                required: "Please select the day of birth"
            }
        }
    });
})();

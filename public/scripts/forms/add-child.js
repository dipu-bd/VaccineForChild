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
        if (year % 4 == 0 && mon == 2) ++max;
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
        day.val(date.getDay());
    }

    function deserializeParam() {
        if (addMode) return;
        // gather elements
        var cid = form.find('input[name="id"]');
        var cname = form.find('input[name="name"]');
        var height = form.find('input[name="height"]');
        var weight = form.find('input[name="weight"]');
        var submitButton = form.find(':submit');
        var modalTitle = $('#access-modal').find('.modal-title');
        // set elements value
        var child = getChildFromUrl();
        cid.val(child.id);
        cname.val(child.name);
        height.val(child.height);
        weight.val(child.weight);
        setBirthDay(new Date(child.dob));
        submitButton.val('Save');
        modalTitle.text('Edit Child')
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
        rules: {},
        messages: {}
    });
})();

(function () {
    var form = $('#addChildForm');
    var errBox = form.find('#error-box');
    var submitButton = form.find(':submit');
    var year = form.find('select[name="year"]');
    var month = form.find('select[name="month"]');
    var day = form.find('select[name="day"]');

    var monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    var setDates = function (mon, year) {
        var max = monthDays[mon];
        if (year % 4 == 0 && mon == 2) ++max;
        day.html('');
        for (var d = 1; d <= max; ++d) {
            day.append('<option value="' + d + '">' + d + '</option>');
        }
    };
    var setMonths = function () {
        month.html('');
        for (var m = 0; m < 12; ++m) {
            month.append('<option value="' + m + '">' + monthNames[m] + '</option>');
        }
    };
    var setYears = function () {
        year.html('');
        var cur = (new Date()).getFullYear();
        for (var y = 0; y <= 20; ++y, --cur) {
            year.append('<option value="' + cur + '">' + cur + '</option>');
        }
    };

    setYears();
    setMonths();
    setDates(1);

    month.on('change', function () {
        setDates(month.val(), year.val());
    });
    year.on('change', function () {
        setDates(month.val(), year.val());
    });

    form.validate({
        submitHandler: function () {
            submitButton.attr('disabled', true);
            $.post('/user/add-child', form.serialize())
                .done(function (result) {
                    if (result === 'OK') {
                        form.trigger("reset");
                        alert('Child added!');
                    } else {
                        errBox.text(result);
                    }
                })
                .fail(function (result) {
                    console.log(result);
                    errBox.text('Connection Failed');
                })
                .always(function () {
                    submitButton.attr('disabled', false);
                });
        },
        errorPlacement: function (error, element) {
           errBox.show(error);
        },
        rules: {},
        messages: {}
    });
})();
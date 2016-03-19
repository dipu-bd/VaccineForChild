(function () {

    var general = $('#general-home-page');

    if (general) {

        var list = general.find('#schedule-list');
        var message = general.find('#messege-data');
        var empty = general.find('#empty-list');

        loadSchedules();

        function loadSchedules() {
            $.get('/user/schedules').done(function (data) {
                if (data) {
                    if (data.length == 0) {
                        list.html(empty);
                    }
                    else {
                        list.html('');
                        for (var i = 0; i < data.length; ++i)
                            buildSchedule(data[i]);
                    }
                }
            });
        }

        function buildSchedule(data) {
            message.find('#dose').html(data.dose);
            message.find('#child').html(data.child);
            message.find('#vaccine').html(data.vaccine);
            message.find('#apply').html((new Date(data.apply)).toDateString());
            message.find('#remaining').html(formatSpan(data.apply - (new Date()).getTime()));
            list.append(message.find('tbody').html());
        }
    }
})();
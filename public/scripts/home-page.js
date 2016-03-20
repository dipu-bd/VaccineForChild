(function () {

    var general = $('#general-home-page');
    var admin = $('#admin-home-page');

    if (general) {

        var list = general.find('#schedule-list');
        var message = general.find('#messege-data');
        var empty = "<div class='flex-full'>Empty List</div>";

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
            var cur = (new Date()).getTime();
            var rem = Math.abs(data.apply - (new Date()).getTime());
            message.find('#remaining').html(formatSpan(rem));
            if (rem < 7 * 24 * 3600 * 1000)
                message.find('tr').addClass('info');
            else
                message.find('tr').removeClass('info');
            list.append(message.find('tbody').html());
        }
    }

    if (admin) {
        $.getScript('/scripts/users.js');
    }
})();
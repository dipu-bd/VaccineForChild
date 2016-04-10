(function () {

    var general = $('#general-home-page');
    var admin = $('#admin-home-page');

    if (general) {

        var EMPTY = '<tr><td colspan="2"><div class="flex-full">Empty List</div></td></tr>';

        var uplist = general.find('#schedule-list');
        var downlist = general.find('#past-schedule-list');
        var message = general.find('#messege-data');

        loadSchedules();

        function loadSchedules() {
            $.get('/user/schedules').done(function (data) {
                if (data) {
                    // clear list
                    uplist.html('');
                    downlist.html('');
                    // sort data
                    data.sort(function (a, b) {
                        return (a.from - b.from) || (a.to - b.to);
                    });
                    // add data
                    for (var i = 0; i < data.length; ++i) {
                        data[i].from = new Date(data[i].from);
                        data[i].to = new Date(data[i].to);
                        buildSchedule(data[i]);
                    }
                    // check if empty
                    if (!uplist.text()) uplist.html(EMPTY);
                    if (!downlist.text()) downlist.html(EMPTY);
                }
            });
        }

        function buildSchedule(data) {
            message.find('#dose').html(data.dose);
            var child = message.find('#child');
            child.html(data.child);
            child.attr('href', '#view-child?'+JSON.stringify({id: data.id}));
            message.find('#vaccine').html(data.vaccine);
            message.find('#fromd').html(data.from.toDateString());
            message.find('#from').html(data.from.toDateString());
            message.find('#tod').html(data.to.toDateString());
            message.find('#to').html(data.to.toDateString());
            if (data.to < new Date()) {
                message.find('#past').addClass('hidden');
                downlist.append(message.html());
            } else {
                message.find('#past').removeClass('hidden');
                uplist.append(message.html());
            }
        }
    }

    if (admin) {
        $.getScript('/scripts/users.js');
    }
})();
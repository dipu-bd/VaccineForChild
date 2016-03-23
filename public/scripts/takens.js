(function () {

        var page = $('#takens-page');
        var takenList = page.find('#taken-list');
        var children = {};
        var taken = {};

        loadValues();

        function loadValues() {
            $.get('/user/get-children').done(function (chld) {
                children = chld;
                $.get('/user/get-taken').done(function (tkn) {
                    children = tkn;
                    $.get('/admin/vaccines').done(function (data) {
                        takenList.html('');
                        data.forEach(function (vaccine) {
                            addVaccine(vaccine);
                        });
                    });
                });
            });
        }

        function addVaccine(vaccine) {
            $.get('/admin/doses-of', {id: vaccine.id}).done(function (data) {
                if (!data || data.length == 0) return;

                var vacBody = "<tr><td rowspan='" + (data.length + 1) + "'>" + vaccine.title + "</td></tr>";
                takenList.append(vacBody);

                data.forEach (function (dose) {
                    var body = "<tr><td>" + dose.name + "</td>";
                    children.forEach(function (child) {
                        body += "<td><input type='checkbox' onclick='checkChange($(this))' " +
                            "id='check-" + child.id + "-" + dose.id + "'></td>";
                    });
                    body += "</tr>";
                    takenList.append(body);
                });
            });
        }
    })();

function checkChange(elem) {
    var id = elem.attr('id');
    var sep = id.split("-");
    var data = {child: Number(sep[1]), dose: Number(sep[2])};
    $.post('/user/add-taken', data).fail(function (data) {
        console.log(data);
        elem.attr('checked', false);
    });
}
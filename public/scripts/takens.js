(function () {

    var page = $('#takens-page');
    var takenList = page.find('#taken-list');
    var editButton = page.find('#edit-button');
    var children, taken;
    var editEnable = false;

    loadValues();

    function loadValues() {
        $.get('/user/get-children').done(function (chilrenRes) {
            children = chilrenRes;
            $.get('/user/get-taken').done(function (takenRes) {
                taken = {};
                takenRes.forEach(function (data) {
                    if (!taken[data.child]) taken[data.child] = {};
                    taken[data.child][data.dose] = true;
                });

                $.get('/admin/vaccines').done(function (data) {
                    takenList.html('');
                    data.forEach(function (vaccine) {
                        addVaccine(vaccine);
                    });
                });
            });
        });
    }

    function isTaken(childId, doseId) {
        return (taken[childId] && taken[childId][doseId]);
    }

    function addVaccine(vaccine) {
        $.get('/admin/doses-of', {id: vaccine.id}).done(function (data) {
            if (!data || data.length == 0) return;

            var vacBody = "<tr><td rowspan='" + (data.length + 1) + "'>" + vaccine.title + "</td></tr>";
            takenList.append(vacBody);

            data.forEach (function (dose) {
                var body = "<tr><td>" + dose.name + "</td>";
                children.forEach(function (child) {
                    body += editEnable ?
                    '<td><input type="checkbox" ' +
                    'onchange="checkChange($(this))" ' +
                    'id="check-' + child.id + '-' + dose.id + '" '
                    + (isTaken(child.id, dose.id) ? 'checked' : '')
                    + '> taken</td>' :
                        (isTaken(child.id, dose.id) ?
                            '<td><i class="glyphicon glyphicon-ok"></i></td>' :
                            '<td><i class="glyphicon glyphicon-minus"></i></td>');
                });
                body += "</tr>";
                takenList.append(body);
            });
        });
    }

    editButton.on('click', function () {
        editEnable = !editEnable;
        loadValues();
        if(editEnable)
        {
            editButton.addClass('btn-default');
            editButton.removeClass('btn-primary');
            editButton.html('<i class="glyphicon glyphicon-ok"></i> Done');
        }
        else
        {
            editButton.removeClass('btn-default');
            editButton.addClass('btn-primary');
            editButton.html('<i class="fa fa-edit"></i> Edit');
        }
    });

})();

function checkChange(elem) {
    var id = elem.attr('id');
    var sep = id.split("-");
    var data = {child: Number(sep[1]), dose: Number(sep[2]), check: elem.is(':checked')};
    $.post('/user/set-taken', data).fail(function (data) {
        console.log(data);
        elem.attr('checked', false);
        taken[data.child][data.dose] = true;
    });
}
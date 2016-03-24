(function () {

    var EMPTY = "<div class='flex-full'>Empty List</div>";

    var page = $('#vaccine-page');
    var vacList = page.find('#vaccine-list');
    var vacBody = page.find('#vaccine-body');
    var doseBody = page.find('#dose-body');

    loadVaccineList();

    page.find('#refresh-button').on('click', loadVaccineList);

    function loadVaccineList() {
        $.get('/admin/vaccines').done(function (data) {
            if (data.length == 0) {
                vacList.html(EMPTY);
            }
            else {
                vacList.html('');
                data.forEach(function (vac) {
                    var wrapper = vacBody.find('#vaccine-wrapper');
                    wrapper.attr('id', 'vaccine-' + vac.id);
                    vacList.append(vacBody.html());
                    buildVaccinePage(vac);
                    wrapper.attr('id', 'vaccine-wrapper');
                });
            }
        });

    }

    function buildVaccinePage(data) {
        var body = vacList.find('#vaccine-' + data.id);
        body.find('#title').html(data.title);
        attachVacEvent(body, data);
        loadDoseList(body.find('#doses-list'), data);
    }

    function loadDoseList(doseList, vac) {
        $.get('/admin/doses-of', {id: vac.id})
            .done(function (data) {
                if (data.length == 0) {
                    doseList.html(EMPTY);
                }
                else {
                    doseList.html('');
                    data.forEach(function (dose) {
                        var wrapper = doseBody.find('#dose-wrapper');
                        wrapper.attr('id', 'dose-' + dose.id);
                        doseList.append(doseBody.html());
                        buildDosePage(doseList, dose);
                        wrapper.attr('id', 'dose-wrapper');
                    });
                }
            });
    }

    function buildDosePage(doseList, data) {
        var body = doseList.find('#dose-' + data.id);
        body.find('#name').html(data.name);
        body.find('#dab').html(data.dab ? formatSpan(data.dab) : "At birth");
        body.find('#period').html(formatSpan(data.period));
        attachDoseEvent(body, data);
    }

    function attachVacEvent(body, data) {
        // attach add dose option
        var addDoseButton = body.find('#add-dose');
        if (addDoseButton) {
            addDoseButton.on('click', function () {
                var qs = encodeURIComponent(JSON.stringify({vaccine: data.id}));
                window.location.href = '#add-dose?' + qs;
            });
        }
        // attach edit option
        var editVacButton = body.find('#edit-vaccine');
        if (editVacButton) {
            editVacButton.on('click', function () {
                var qs = encodeURIComponent(JSON.stringify(data));
                window.location.href = '#edit-vaccine?' + qs;
            });
        }
        // attach delete option
        var deleteVacButton = body.find('#delete-vaccine');
        if (deleteVacButton) {
            deleteVacButton.on('click', function () {
                if (confirm("Are you sure to delete this vaccine?")) {
                    $.post('/admin/delete-vaccine', data, function (data, status) {
                        if (status == 'success') {
                            body.remove();
                        } else {
                            console.log(data);
                            alert("Could not delete the vaccine");
                        }
                    })
                }
            });
        }
    }

    function attachDoseEvent(body, data) {
        // attach edit option
        var editDoseButton = body.find('#edit-dose');
        if (editDoseButton) {
            editDoseButton.on('click', function () {
                var qs = encodeURIComponent(JSON.stringify(data));
                window.location.href = '#edit-dose?' + qs;
            });
        }
        // attach delete option
        var deleteDoseButton = body.find('#delete-dose');
        if (deleteDoseButton) {
            deleteDoseButton.on('click', function () {
                if (confirm("Are you sure to delete this dose?")) {
                    $.post('/admin/delete-dose', data, function (data, status) {
                        if (status == 'success') {
                            body.remove();
                        } else {
                            console.log(data);
                            alert("Could not delete the dose");
                        }
                    })
                }
            });
        }
    }

})();
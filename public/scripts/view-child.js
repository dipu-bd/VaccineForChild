(function () {

    var page = $('#view-child-page');
    var children = null;
    var heightCharts = {};
    var weightCharts = {};

    deserializeParam();
    loadForms();
    loadGraphs();

    function getChildren(callback) {
        if (children)
            callback(children);
        else {
            $.get('/user/get-children').done(function (data) {
                children = data;
                callback(children);
            });
        }
    }

    function loadForms() {
        getChildren(function (children) {
            children.forEach(function (child) {
                attachFormEvents(child.id);
            });
        });
    }

    function deserializeParam() {
        // set default values
        var child = getDataFromUrl();
        if (child) {
            page.find('#child-li-' + child.id).tab('show');
            page.find('#child-tab-' + child.id).addClass('in active');
        } else {
            getChildren(function (children) {
                if (children[0].id) {
                    var id = children[0].id;
                    page.find('#child-li-' + id).tab('show');
                    page.find('#child-tab-' + id).addClass('in active');
                }
            });
        }
    }

    function loadGraphs() {
        getChildren(function (children) {
            children.forEach(function (child) {
                setData(child);
                setHeights(child.id);
                setWeights(child.id);
            });
        });
    }

    function setData(child) {
        var body = page.find('#child-tab-'+ child.id);
        // gather elements
        var name = body.find('#name');
        var dob = body.find('#dob');
        var age = body.find('#age');
        var gender = body.find('#gender');
        var taken = body.find('#taken');
        // set data to elements
        name.text(child.name);
        dob.text(new Date(child.dob).toDateString());
        age.text(getAge(child.dob));
        gender.attr('class', 'fa fa-2x fa-' + child.gender);
        // taken doses
        $.get('/user/child-dose', {id: child.id}).done(function (data) {
            taken.text(data);
        });
    }

    Chart.defaults.global.responsive = true;
    Chart.defaults.global.maintainAspectRatio = true;

    function setHeights(id) {
        if (!id) return;
        $.get('/user/get-heights', {id: id}).done(function (heights) {
            var data = {
                labels: [],
                series: [[]]
            };
            var options = {
                fullWidth: true,
                width: 800,
                height: 400
            };

            // add data
            heights.forEach(function (height) {
                data.series[0].push({
                    x: new Date(height.date),
                    y: height.value
                });
                data.labels.push((new Date(height.date)).toDateString());
            });

            //set data to chart
            heightCharts[id] = new Chartist.Line('#height-chart-' + id, data, options);
        });
    }

    function setWeights(id) {
        if (!id) return;
        $.get('/user/get-weights', {id: id}).done(function (weights) {
            var data = {
                labels: [],
                series: [[]]
            };
            var options = {
                fullWidth: true,
                width: 800,
                height: 400
            };

            // add data
            weights.forEach(function (weight) {
                data.series[0].push({
                    x: new Date(weight.date),
                    y: weight.value
                });
                data.labels.push((new Date(weight.date)).toDateString());
            });

            // set data to canvas
            weightCharts[id] = new Chartist.Line('#weight-chart-' + id, data, options);
        });
    }

    page.find('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        Object.keys(heightCharts).forEach(function (key) {
            heightCharts[key].update();
        });
        Object.keys(weightCharts).forEach(function (key) {
            weightCharts[key].update();
        });
    });

    function attachFormEvents(id) {

        var heightForm = page.find('#add-height-form-' + id);
        var weightForm = page.find('#add-weight-form-' + id);

        heightForm.validate({
            submitHandler: function () {
                // send add-child request
                submitPostRequest(heightForm, '/user/add-height', function () {
                    //alert('Height added');
                    setHeights(id);
                });
            },
            rules: {
                date: {
                    required: true
                },
                value: {
                    required: true
                }
            },
            messages: {
                date: {
                    required: "Please insert the date when you measured the height"
                },
                value: {
                    required: "Please insert a height"
                }
            }
        });

        weightForm.validate({
            submitHandler: function () {
                // send add-child request
                submitPostRequest(weightForm, '/user/add-weight', function () {
                    //alert('Weight added');
                    setWeights(id);
                });
            },
            rules: {
                date: {
                    required: true
                },
                value: {
                    required: true
                }
            },
            messages: {
                date: {
                    required: "Please insert the date when you measured the weight"
                },
                value: {
                    required: "Please insert a weight"
                }
            }
        });
    }
})();
(function () {
    var children = $('#children-page');
    var childrenList = children.find('#children-list');
    var childPage = null;

    function buildChildPage(page, child) {
        // add page
        var id = "child-" + child.id;
        var body = "<div class='col-xs-12 col-sm-6 col-md-4' id='" + id + "'>" + page + "</div>";
        childrenList.append(body);
        page = childrenList.find('#' + id);
        // gather elements
        var name = page.find('#name');
        var dob = page.find('#dob');
        var age = page.find('#age');
        var height = page.find('#height');
        var weight = page.find('#weight');
        //TODO: calculate age from birthday
        child.age = "0 days";
        // date of birth
        var time = new Date(child.dob);
        // set data to elements
        name.text(child.name);
        dob.text(time.toDateString());
        age.text(child.age + " old");
        height.text(child.height + "\"");
        weight.text(child.weight + "kg");
    }

    function getChildPage(callback) {
        $.get('/user/child-page', function (data, status) {
            if (status == 'success') {
                childPage = data;
                callback(childPage);
            } else {
                console.log(data);
            }
        });
    }

    function showAllChildren() {
        console.log('here i am');
        $.get('/user/get-children', function (data, status) {
            if (status == 'success' && data) {
                console.log(data);
                // clear previous list
                childrenList.html('');
                // add all children
                getChildPage(function (page) {
                    for (var i = 0; i < data.length; ++i) {
                        var child = data[i];
                        buildChildPage(page, child);
                    }
                });
            } else {
                console.log(data);
                console.log('foul!');
            }
        });
    }

    showAllChildren();

})();
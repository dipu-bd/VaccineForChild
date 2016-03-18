(function () {
    var children = $('#children-page');
    var childrenList = children.find('#children-list');
    var childPage = null;

    children.find('#refreshButton').on('click', loadAllChildren);

    function getAge(bday) {
        //TODO: return age like- "10 days" or "2 years 3 months"
        var cur = new Date().getTime() - bday;
        var day = Math.floor(cur / (24 * 3600 * 1000));
        return day + " days";
    }

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
        var weight = page.find('#weight');// date of birth
        //calculate age from birthday
        var time = new Date(child.dob);
        child.age = getAge(child.dob);
        // set data to elements
        name.text(child.name);
        dob.text(time.toDateString());
        age.text(child.age + " old");
        height.text(child.height + "\"");
        weight.text(child.weight + "kg");
        // add events
        page.find('#edit').on('click', function () {
            editClicked(child.id);
        });
        page.find('#delete').on('click', function () {
            deleteClicked(child.id);
        })
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

    function loadAllChildren() {
        $.get('/user/get-children', function (data, status) {
            // clear previous list
            childrenList.html('');

            if (status == 'success' && data && data.length > 0) {
                // add all children
                getChildPage(function (page) {
                    for (var i = 0; i < data.length; ++i) {
                        buildChildPage(page, data[i]);
                    }
                });
            } else {
                console.log(data);
            }
        });
    }

    // run at first time
    loadAllChildren();

    function editClicked(id) {

    }

    function deleteClicked(id) {
        if (confirm("Are you sure to delete one child?")) {
            $.post('/user/delete-child', {id: id}, function (data, status) {
                console.log(data);
                if (status === 'success') {
                    childrenList.find('#child-' + id).remove();
                }
                else {
                    console.log(data);
                }
            })
        }
    }


})();
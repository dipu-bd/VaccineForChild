(function () {
    var children = $('#children-page');
    var childrenList = children.find('#children-list');
    var childPage = null;

    // run at first time
    loadAllChildren();

    // add refresh button event
    children.find('#refreshButton').on('click', loadAllChildren);

    // shows all children in children-list div
    function loadAllChildren() {
        $.get('/user/get-children', function (data, status) {
            // clear previous list
            childrenList.html('');

            if (status == 'success' && data) {
                // add all children
                getChildPage(function (page) {
                    for (var i = 0; i < data.length; ++i) {
                        buildChildPage(page, data[i]);
                    }
                });
            }
        });
    }

    // get child-page from server
    function getChildPage(callback) {
        $.get('/child-page', function (data, status) {
            if (status == 'success') {
                childPage = data;
                callback(childPage);
            }
        });
    }

    function getChildWrapper(id, page) {
        return "<div class='form-group' id='" + id + "'>" + page + "</div>";
    }

    // append child page to the children list
    function buildChildPage(page, child) {
        // append page and find it
        var id = "child-" + child.id;
        var body = getChildWrapper(id, page);
        childrenList.append(body);
        page = childrenList.find('#' + id);
        // set data
        setChildData(page, child);
        // add events
        page.find('#edit').on('click', function () {
            editClicked(child);
        });
        page.find('#delete').on('click', function () {
            deleteClicked(child);
        })
    }

    function setChildData(page, child) {
        // gather elements
        var name = page.find('#name');
        var dob = page.find('#dob');
        var age = page.find('#age');
        var height = page.find('#height');
        var weight = page.find('#weight');
        var gender = page.find('#gender');
        // set data to elements
        name.text(child.name);
        dob.text(new Date(child.dob).toDateString());
        age.text(getAge(child.dob));
        height.text(child.height + "\"");
        weight.text(child.weight + "kg");
        gender.attr('class', 'fa fa-2x fa-' + child.gender);
    }

    function editClicked(child) {
        var qs = encodeURIComponent(JSON.stringify(child));
        window.location.href = '#edit-child?' + qs;
    }

    function deleteClicked(child) {
        if (confirm("Are you sure to delete one child?")) {
            $.post('/user/delete-child', child, function (data, status) {
                if (status === 'success') {
                    childrenList.find('#child-' + child.id).remove();
                }
                else {
                    console.log(data);
                    alert("Could not delete the child");
                }
            })
        }
    }

    /**
     * Calculate age from birthday
     * @param bday Birthday in unix timestamp
     * @returns {string} return age like- "10 days" or "2 years 3 months"
     */
    function getAge(bday) {
        var date = new Date();
        return formatSpan((date.getTime() - bday));
    }

})();
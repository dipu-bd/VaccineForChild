(function () {
    var children = $('#children-page');
    var childrenList = children.find('#children-list');
    var childPage = null;

    // run at first time
    loadAllChildren();

    children.find('#refreshButton').on('click', loadAllChildren);

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
            editClicked(child.id);
        });
        page.find('#delete').on('click', function () {
            deleteClicked(child.id);
        })
    }

    function getChildWrapper(id, page) {
        return "<div class='form-group' id='" + id + "'>" + page + "</div>";
    }

    function setChildData(page, child) {
        // gather elements
        var name = page.find('#name');
        var dob = page.find('#dob');
        var age = page.find('#age');
        var height = page.find('#height');
        var weight = page.find('#weight');
        // set data to elements
        name.text(child.name);
        dob.text(new Date(child.dob).toDateString());
        age.text(getAge(child.dob));
        height.text(child.height + "\"");
        weight.text(child.weight + "kg");
    }

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

    /**
     * Calculate age from birthday
     * @param bday Birthday in unix timestamp
     * @returns {string} return age like- "10 days" or "2 years 3 months"
     */
    function getAge(bday) {
        var ret = "";
        var date = new Date();
        var diffDay = (date.getTime() - bday) / 86400000;
        var years = Math.floor(diffDay / 365);
        diffDay -= years * 365;
        var months = Math.floor(diffDay / 31);
        diffDay -= months * 31;
        var days = Math.floor(diffDay);
        if (years > 0) ret += years + " year" + (years > 1 ? "s " : " ");
        if (months > 0) ret += months + " month" + (months > 1 ? "s " : " ");
        if (days > 0) ret += days + " day" + (days > 1 ? "s " : " ");
        if (ret === "") ret = "0 day";
        return ret.trim();

    }

})();
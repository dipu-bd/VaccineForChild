(function () {
    var children = $('#children-page');
    var childrenList = children.find('#children-list');
    var childBody = children.find('#child-body');

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
                for (var i = 0; i < data.length; ++i) {
                    buildChildPage(data[i]);
                }
            }
        });
    }

    // append child page to the children list
    function buildChildPage(child) {
        // append page
        var wrapper = childBody.find('#child-wrapper');
        wrapper.attr('id', "child-" + child.id);
        childrenList.append(childBody.html());
        wrapper.attr('id', 'child-wrapper');
        // find page
        var page = childrenList.find('#child-' + child.id);
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
        var taken = page.find('#taken');
        // set data to elements
        name.text(child.name);
        dob.text(new Date(child.dob).toDateString());
        age.text(getAge(child.dob));
        height.text(child.height + "\"");
        weight.text(child.weight + "kg");
        gender.attr('class', 'fa fa-2x fa-' + child.gender);
        // taken doses
        $.get('/user/child-dose', {id: child.id}).done(function (data) {
            taken.text(data);
        });
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
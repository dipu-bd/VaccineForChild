(function () {
    var children = $('#children-page');
    var childrenList = children.find('#children-list');
    var childPage = null;

    function getAge(bday) {
        //TODO: return age like- "10 days" or "2 years 3 months"
        var ret = "";
        Date date = new Date();
        var diffDay =  Math.floor(( date.getTime() - bday.getTime()) ) / 86400000);
        var years = Math.floor(diffDay/365);
        var months = Math.floor((diffDay % 365) / 31);
        var days = (diffDay % 365) % 31 ;
        if( years > 0) ret += years + " year" + (years > 1 ? "s " : "");
        if(months > 0) ret += months + " month" + (months > 1 ? "s" : "");
        if(days > 0) ret += days + " day" + (days > 1 ? "s" : "");
        if(ret === "") ret = "0 day";
        return ret;
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
        var time = new Date(child.dob);
        //calculate age from birthday
        child.age = getAge(time);
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
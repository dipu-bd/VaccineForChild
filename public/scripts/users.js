(function () {

    var EMPTY = '<div class="flex-full">Empty List</div>';

    var page = $('#users-page');
    var userList = $('#user-list');
    var userBody = $('#user-body');

    loadAllUsers();

    page.find('#refresh-button').on('click', loadAllUsers);

    function loadAllUsers() {
        $.get('/admin/users').done(function (data) {
            if (data.length == 0) {
                userList.html(EMPTY);
            } else {
                userList.html('');
                data.forEach(function (user) {
                    // append new user body
                    var wrapper = userBody.find('#user-wrapper');
                    wrapper.attr('id', 'user-' + user.id);
                    userList.append(userBody.html());
                    wrapper.attr('id', 'user-wrapper');
                    // set body content
                    var page = userList.find('#user-' + user.id);
                    setParams(page, user);
                    attachEvents(page, user);
                });
            }
        });
    }

    function setParams(page, user) {
        Object.keys(user).forEach(function (key) {
            var elem = page.find('#' + key);
            if (elem) elem.html(user[key] || "[Not set]");
        });
        // set access
        setAccess(page, user);
        // get child count
        $.get('/admin/children-count', {id: user.id}).done(function (data) {
            page.find('#child-count').html(data);
        });
    }

    function setAccess(page, user) {
        var access = page.find('#access');
        access.html('');
        access.attr('class', 'fa fa-2x ' + (user.access ? 'fa-user-secret' : 'fa-user'));
    }

    function attachEvents(page, user) {

        // attach MAKE ADMIN event
        page.find('#admin-button').on('click', function () {
            // make the user an admin
            $.post('/admin/make-admin', user).done(function (data) {
                if (data) {
                    alert(data);
                }
                else {
                    user.access = 1;
                    setAccess(page, user);
                }
            });
        });

        // attach DELETE event
        page.find('#delete-button').on('click', function () {
            if (confirm("Are you sure remove this user?")) {
                // delete the user
                $.post('/admin/delete-user', user).done(function (data) {
                    if (data) alert(data);
                    else page.remove();
                });
            }
        });
    }

})();
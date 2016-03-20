(function () {

    var EMPTY = '<tr><td><div class="flex-full">Empty List</div></td></tr>';

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
                    var wrapper = userBody.find('#user-wrapper');
                    wrapper.attr('id', 'user-' + user.id);
                    userList.append(userBody.html());
                    wrapper.attr('id', 'user-wrapper');
                    var page = userList.find('#user-' + user.id);
                    setParams(page, user);
                    attachEvents(page, user);
                });
            }
        });
    }

    function setParams(page, user) {

    }

    function attachEvents(page, user) {

    }

    function makeAdmin(user) {

    }

    function sendSMS(user) {

    }

    function sendEmail(user) {

    }

    function deleteUser(user) {

    }

})();
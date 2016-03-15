/*
 After document is ready
 */
$(document).ready(function () {

    //
    // Load Navigation bar
    //
    $('#nav-bar').load('/nav-bar', function (data, status) {
        if (status !== 'success') {
            console.log(data);
        }
        $('#login-button').click(function () {
            showForm('login', '/forms/login', 'Sign In', true);
        });
        $('#confirm-button').click(function () {
            showForm('confirm', 'forms/confirm', 'Confirm Email', true);
        });
        $('#change-pass-button').click(function () {
            showForm('change-pass', 'forms/change-pass', 'Change Password', true);
        });
        $('#user-button').click(function () {

        });
    });

    //
    // Load Home Page
    //
    $('#home-page').load('/home-page', function (data, status) {
        if (status === 'success') {
            $('#register-form-wrapper').load('/forms/register');
        }
    });

    //
    // Load Bottom Bar
    //
    $('#bottom-bar').load('/bottom-bar');

});


//
// Show Modal Form
//
var allForms = {};
var DEFAULT_MODAL_BODY = '<span class="glyphicon glyphicon-hourglass" style="font-size:72px;"></span>';

var showForm = function (id, getUrl, title, small) {
    // set modal size
    if (small) $('.modal-dialog').addClass("modal-sm");
    else $('.modal-dialog').removeClass("modal-sm");
    // set modal title
    $('.modal-title').html(title);
    // show modal
    $('#access-modal').modal('show');
    // set modal body
    var body = $('.modal-body');
    if (allForms[id]) { // body is loaded
        body.html(allForms[id]);
    }
    else { // load body from server
        body.html(DEFAULT_MODAL_BODY);
        body.load(getUrl, function (data, status) {
            if (status === 'success') {
                allForms[id] = data;
            } else {
                console.log(data);
            }
        });
    }
};

var hideForm = function () {
    $("#access-modal").modal('hide');
};



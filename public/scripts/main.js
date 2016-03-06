$(document).ready(function () {

    //
    // Load Navigation bar
    //
    $('#nav-bar').load('/nav-bar', function (data, status) {
        if(status !== 'success') {
            console.log(data);
        }

        $('#login-button').click(function () {
            showForm('login', '/forms/login', 'Login', true);
        });
        $('#register-button').click(function () {

        });
        $('#confirm-button').click(function () {

        });
        $('#user-button').click(function () {

        });
        $('#change-pass-button').click(function () {

        });
    });

    //
    // Load Home Page
    //
    $('#home-page').load('/home-page');

    //
    // Load Bottom Bar
    //
    $('#bottom-bar').load('/bottom-bar');

});


//
// Show Modal Form
//
var allForms = {};
var DEFAULT_MODAL_BODY = '<img src="/images/loading_spinner.gif" alt="Loading..." id="loading-image">';

var hideForm = function () {
    $("#access-modal").modal('hide');
};

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

var showFormError = function (err) {
    var errBox = $('#error-box');
    errBox.text(err);
    if (err) errBox.fadeIn();
    else errBox.fadeOut();
};

var handleLogin = function () {
    $.post('/auth/login',
        $('#loginForm').serialize(),
        function (result, status, jqXHR) {
            if (status === 'success') {
                if (result === 'OK') {
                    window.location.href = '/';
                } else {
                    showFormError(result);
                }
            }
            else {
                showFormError('Connection Failed');
            }
        });
};

//
// Verify Forms
//
var EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;

var verifyPass = function (pass) {
    if (!pass || pass.length < 6)
        return "Password length should be greater than 6";
    for (var i = 0; i < pass.length; ++i) {
        if (pass[i] <= 30 && pass[i] >= 128)
            return "Password contains invalid characters";
    }
    return false;
};

var verifyEmail = function (email) {
    if (!email || email.length < 5)
        return "Email should not be empty!";
    if (!EMAIL_REGEXP.test(email))
        return "Email format is not valid";
    return null;
};

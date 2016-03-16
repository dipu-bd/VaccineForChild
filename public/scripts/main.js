/*
 After document is ready
 */
$(document).ready(function () {
    // Bind the hash change event.
    $(window).bind('hashchange', handleHashChange);

    // Load Navigation bar
    $('#nav-bar').load('/nav-bar', function (data, status) {
        if (status !== 'success') {
            console.log(data);
        }
    });

    // Load Bottom Bar
    $('#bottom-bar').load('/bottom-bar', function (data, status) {
        if (status !== 'success') {
            console.log(data);
        }
    });

    // clear hash on modal hide
    $('#access-modal').on('hidden.bs.modal', handleModalHide);

    handleHashChange();
});

//
// Show Home page
//
var allPages = {};

/**
 * Load home page
 * @param id Id, as well as the address to get home page
 */
var loadHomePage = function (id) {
    var home = $('#home-page');
    if (allPages[id]) {
        home.html(allPages[id]);
        loadRegForm();
    }
    else {
        home.load('/' + id, function (data, status) {
            if (status === 'success') {
                allPages[id] = data;
                loadRegForm()
            } else {
                console.log(data);
            }
        });
    }
};

function loadRegForm() {
    var regForm = $('#register-form-wrapper');
    if (regForm) {
        if (allForms['register']) {
            regForm.html(allForms['register']);
        }
        else {
            regForm.load('/forms/register', function (data, status) {
                if (status === 'success') {
                    allForms['register'] = data;
                }
            });
        }
    }
}

var handleHashChange = function () {
    var anchor = window.location.hash;
    switch (anchor) {
        case '#login':
            loadForm('login', 'Sign In', true);
            break;
        case '#confirm':
            loadForm('confirm', 'Confirm Email', true);
            break;
        case '#change-pass':
            loadForm('change-pass', 'Change Password', true);
            break;
        case '#profile':
            loadHomePage('profile');
            break;
        case '#children':
            loadHomePage('children');
            break;
        case '#users':
            loadHomePage('users');
            break;
        case '#vaccines':
            loadHomePage('vaccines');
            break;
        default:
            loadHomePage('home-page');
            break;
    }
};

//
// Show Modal Form
//
var allForms = {};
var DEFAULT_MODAL_BODY = '<span class="glyphicon glyphicon-hourglass" style="font-size:72px;"></span>';

var loadForm = function (id, title, small) {
    // select elements
    var mmain = $('#access-modal');
    var dialog = $('#access-modal .modal-dialog');
    var mtitle = $('#access-modal .modal-title');
    var body = $('#access-modal .modal-body');
    // set modal size
    if (small) dialog.addClass("modal-sm");
    else dialog.removeClass("modal-sm");
    // set modal title
    mtitle.html(title);
    // show modal
    mmain.modal('show');
    // set modal body
    if (allForms[id]) { // body is loaded
        body.html(allForms[id]);
    }
    else { // load body from server
        body.html(DEFAULT_MODAL_BODY);
        body.load('/forms/' + id, function (data, status) {
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

var handleModalHide = function () {
    window.history.back();
};
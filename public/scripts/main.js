$(document).ready(function () {
    // load top and bottom panels
    loadNavBar();
    loadBottomBar();

    // Bind the hash change event.
    $(window).bind('hashchange', handleHashChange);

    // clear hash on modal hide
    $('#access-modal').on('hidden.bs.modal', handleModalHide);

    // load page content
    handleHashChange();
});

//
// Show Home page
//
var cachedPages = {};
var currentHomePage = null;

// Load Navigation bar
var loadNavBar = function () {
    $('#nav-bar').load('/nav-bar', function (data, status) {
        if (status !== 'success') {
            console.log(data);
        }
    });
};

// Load Bottom Bar
var loadBottomBar = function () {
    $('#bottom-bar').load('/bottom-bar', function (data, status) {
        if (status !== 'success') {
            console.log(data);
        }
    });
};

/**
 * Load home page
 * @param id Id, as well as the address to get home page
 * @param force True to force to reload home page
 */
var loadHomePage = function (id, force) {
    if (!force && currentHomePage === id) return;
    var home = $('#home-page');
    if (cachedPages[id]) {
        home.html(cachedPages[id]);
        currentHomePage = id;
    }
    else {
        home.load('/' + id, function (data, status) {
            if (status == 'success') {
                cachedPages[id] = data;
                currentHomePage = id;
            }
            else {
                console.log(data);
            }
        });
    }
};

// load registration form
function includeRegForm() {
    var regForm = $('#register-form-wrapper');
    if (regForm) {
        if (cachedForms['register']) {
            regForm.html(cachedForms['register']);
        }
        else {
            regForm.load('/forms/register', function (data, status) {
                if (status === 'success') {
                    cachedForms['register'] = data;
                }
            });
        }
    }
}

function focusRegForm() {
    var form = $('#registerForm');
    var uname = form.find('input[name=\'uname\']');
    uname.focus();
    form.animate({margin: '5px 0 0 0'}, 100);
    form.animate({margin: '-5px 0 0 0'}, 100);
    form.animate({margin: '5px 0 0 0'}, 100);
    form.animate({margin: '-5px 0 0 0'}, 100);
    form.animate({margin: '5px 0 0 0'}, 100);
    form.animate({margin: '-5px 0 0 0'}, 100);
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
var cachedForms = {};
var DEFAULT_MODAL_BODY = '<i class="fa fa-5x fa-refresh fa-spin"></i>';

var loadForm = function (id, title, small) {
    // select elements
    var mmain = $('#access-modal');
    var dialog = mmain.find('.modal-dialog');
    var mtitle = mmain.find('.modal-title');
    var body = mmain.find('.modal-body');
    // set modal size
    if (small) dialog.addClass("modal-sm");
    else dialog.removeClass("modal-sm");
    // set modal title
    mtitle.html(title);
    // show modal
    mmain.modal('show');
    // set modal body
    if (cachedForms[id]) { // body is loaded
        body.html(cachedForms[id]);
    }
    else { // load body from server
        body.html(DEFAULT_MODAL_BODY);
        // first get body
        body.load('/forms/' + id, function (data, status) {
            if (status === 'success') {
                cachedForms[id] = data;
            } else {
                console.log(data);
            }
        });
        // then the script
        $.getScript('/scripts/forms/' + id + '.js', function (data, status) {
            if (status !== 'success') {
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

var reloadPage = function () {
    cachedForms = {};
    cachedPages = {};
    handleHashChange();
    load
};
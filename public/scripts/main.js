var currentHomePage = null;
var DEFAULT_MODAL_BODY = '<i class="fa fa-5x fa-refresh fa-spin"></i>';

// enable caching
$.ajaxSetup({
    cache: true
});

// load the document
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

// Load Navigation bar
function loadNavBar() {
    $('#nav-bar').load('/nav-bar', function (data, status) {
        if (status !== 'success') {
            console.log(data);
        }
    });
}

// Load Bottom Bar
function loadBottomBar() {
    $('#bottom-bar').load('/bottom-bar', function (data, status) {
        if (status !== 'success') {
            console.log(data);
        }
    });
}

// Show Home page
function loadHomePage(id, force) {
    if (!force && currentHomePage === id) return;
    var home = $('#home-page');
    home.load('/' + id, function (data, status) {
        if (status == 'success') {
            currentHomePage = id;
            $.getScript('/scripts/' + id + '.js', function (data, status) {
                if (status !== 'success') console.log(data);
            });
        }
        else {
            console.log(data);
        }
    });
}

// Show Modal Form
function loadForm(id, title, small) {
    // select elements
    var modal = $('#access-modal');
    var modalDialog = modal.find('.modal-dialog');
    var modalTitle = modal.find('.modal-title');
    var body = modal.find('.modal-body');
    // set modal size
    if (small) modalDialog.addClass("modal-sm");
    else modalDialog.removeClass("modal-sm");
    // set modal title
    modalTitle.html(title);
    // show modal
    modal.modal('show');
    // load body from server
    body.html(DEFAULT_MODAL_BODY);
    // first get body
    body.load('/forms/' + id, function (data, status) {
        if (status === 'success') {
            $.getScript('/scripts/forms/' + id + '.js', function (data, status) {
                if (status !== 'success') {
                    console.log(data);
                }
            });
        }
        else {
            console.log(data);
        }
    });
}

// load registration form
function includeRegForm() {
    var regForm = $('#register-form-wrapper');
    if (regForm) {
        regForm.load('/forms/register', function (data, status) {
            if (status === 'success') {
                $.getScript('/scripts/forms/register.js', function (data, status) {
                    if (status !== 'success') {
                        console.log(data);
                    }
                });
            }
            else {
                console.log(data);
            }
        });
    }
}

function focusRegForm() {
    var elem = $('#register-modal-content');
    var form = elem.find('#registerForm');
    var uname = form.find('input[name=\'uname\']');
    // focus on the form
    uname.focus();
    // animate to bring user attention
    for (var i = 0; i < 3; ++i) {
        elem.animate({marginTop: '+=10px'}, 100);
        elem.animate({marginTop: '-=10px'}, 100);
    }
}

function handleHashChange() {
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
}

function hideForm() {
    $("#access-modal").modal('hide');
}

function handleModalHide() {
    window.history.back();
}

function reloadPage() {
    loadNavBar();
    loadBottomBar();
    handleHashChange();
}
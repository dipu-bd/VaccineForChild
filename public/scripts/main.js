var GlobalData = {
    currentHomePage: null,
    DEFAULT_MODAL_BODY: '<i class="fa fa-5x fa-refresh fa-spin"></i>'
};

// enable caching
$.ajaxSetup({
    cache: true
});

// load the document
$(document).ready(function () {
    GlobalData.homePageDiv = $('#home-page');
    GlobalData.bottomBar = $('#bottom-bar');
    GlobalData.navBar = $('#nav-bar');
    GlobalData.accessModal = $("#access-modal");

    // load top and bottom panels
    loadNavBar();
    loadBottomBar();

    // Bind the hash change event.
    $(window).bind('hashchange', handleHashChange);

    // clear hash on modal hide
    GlobalData.accessModal.on('hidden.bs.modal', handleModalHide);

    // load page content
    handleHashChange();
});

// Load Navigation bar
function loadNavBar() {
    GlobalData.navBar.load('/nav-bar', function (data, status) {
        if (status !== 'success')
            console.log(data);
    });
}

// Load Bottom Bar
function loadBottomBar() {
    GlobalData.bottomBar.load('/bottom-bar', function (data, status) {
        if (status !== 'success')
            console.log(data);
    });
}

function loadElement(elem, url, scriptUrl, callback) {
    elem.load(url, function (data, status) {
        if (status != 'success') {
            console.log(data);
            return;
        }
        $.getScript(scriptUrl, function (data, status) {
            if (status !== 'success')
                console.log(data);
            else if (callback)
                callback();
        });
    });
}

// Show Home page
function loadHomePage(id) {
    loadElement(GlobalData.homePageDiv, '/' + id, '/scripts/' + id + '.js', function () {
        GlobalData.currentHomePage = id;
    });
}

// Show Modal Form
function loadForm(id, title, small) {
    // select elements
    var modal = GlobalData.accessModal;
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
    body.html(GlobalData.DEFAULT_MODAL_BODY);
    loadElement(body, '/forms/' + id, '/scripts/forms/' + id + '.js');
}

// load registration form
function includeRegForm() {
    var regForm = $('#register-form-wrapper');
    if (regForm) {
        loadElement(regForm, '/forms/register', '/scripts/forms/register.js');
    }
}

function focusRegForm() {
    var elem = $('#register-modal-content');
    var form = elem.find('#registerForm');
    var uname = form.find('input[name="uname"]');
    // focus on the form
    uname.focus();
    // animate to bring user attention
    for (var i = 0; i < 3; ++i) {
        elem.animate({marginTop: '+=10px'}, 100);
        elem.animate({marginTop: '-=10px'}, 100);
    }
}

function handleHashChange() {
    var anchor = (window.location.hash.match(/#[^?]+/g) || [""])[0];
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
        case '#add-child':
        case '#edit-child':
            loadForm('add-child', 'Add New Child', true);
            break;
        case '#add-phone':
            loadForm('add-phone', 'Add New Phone', true);
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
    GlobalData.accessModal.modal('hide');
}

function handleModalHide() {
    window.history.back();
}

function reloadPage() {
    loadNavBar();
    loadBottomBar();
    handleHashChange();
}

/**
 * Send a submit request to server
 * @param form Form to submit
 * @param url URL to submit to
 * @param callback gets called when success
 * @param submitButton The submit button element
 * @param submitText Text to display when sending submit request
 */
function submitPostRequest(form, url, callback, submitText, submitButton) {
    // gather elements
    var errBox = form.find('#error-box');
    if (!submitText) submitText = 'Submitting...';
    if (!submitButton) submitButton = form.find(':submit');
    console.log(submitButton);
    // set submit button text
    var txt = submitButton.val();
    submitButton.val(submitText);
    submitButton.attr('disabled', true);
    // send a post request
    $.post(url, form.serialize())
        .done(function (data) {
            if (data) {
                errBox.text(data);
            } else if (callback) {
                callback();
            }
        })
        .fail(function (data) {
            console.log(data);
            switch (data.status / 100) {
                case 4:
                    errBox.text('Connection Failed!');
                    break;
                case 5:
                    errBox.text('Internal Server Error!');
                    break;
                default:
                    errBox.text('Unknown Error!');
                    break;
            }
        })
        .always(function () {
            submitButton.val(txt);
            submitButton.attr('disabled', false);
        });
}

function formatSpan(span) {
    // divide into components
    span /= (24 * 3600 * 1000);
    var years = Math.floor(span / 365);
    span -= years * 365;
    var months = Math.floor(span / 31);
    span -= months * 31;
    var days = Math.floor(span);
    // calculate return value
    var ret = "";
    if (years > 0) ret += years + " year" + (years > 1 ? "s " : " ");
    if (months > 0) ret += months + " month" + (months > 1 ? "s " : " ");
    if (days > 0) ret += days + " day" + (days > 1 ? "s " : " ");
    return ret.trim() || "0 day";
}
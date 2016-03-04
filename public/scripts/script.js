var EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
var DEFAULT_MODAL_BODY = '<img src="/images/loading_spinner.gif" alt="Loading..." id="loading-image">';



document.verifyPass = function (pass) {
    if (!pass || pass.length < 6)
        return "Password length should be greater than 6";
    for (var i = 0; i < pass.length; ++i) {
        if (pass[i] <= 30 && pass[i] >= 128)
            return "Password contains invalid characters";
    }
    return false;
};

document.verifyEmail = function (email) {
    if (!email || email.length < 5)
        return "Email should not be empty!";
    if (!EMAIL_REGEXP.test(email))
        return "Email format is not valid";
    return null;
};

document.showModal = function (form, title, small) {
    if (!form) form = DEFAULT_MODAL_BODY;
    $('.modal-title').html(title);
    $('.modal-body').html(form);
    if (small) $('.modal-dialog').addClass("modal-sm");
    else $('.modal-dialog').removeClass("modal-sm");
    $('#access-modal').modal('show');
};

document.hideModal = function () {
    $("#access-modal").modal('hide');
};

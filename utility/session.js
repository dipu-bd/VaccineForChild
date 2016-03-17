var debug = require('debug')('VaccineForChild:session');
var crypto = require('crypto');

var KEY_LENGTH = 16;
var SESSION_ID_COOKIE = 'SessionID';

var allSession = {};

var getKey = function () {
    var key = null;
    while (!key || allSession.hasOwnProperty(key))
        key = crypto.randomBytes(KEY_LENGTH).toString('hex');
    return key;
};

var getConfirmCode = function () {
    // generate confirm code : 5 digits
    return Math.floor((Math.random() * 899999) + 100000);
};

var addSession = function (data) {
    data.key = getKey();
    data.creationTime = (new Date()).getTime();
    data.lastAccessTime = (new Date()).getTime();
    allSession[data.key] = data;

    debug("Created: " + data.key);
    return data;
};

var getSession = function (key) {
    if (allSession.hasOwnProperty(key)) {
        var session = allSession[key];
        session.lastAccessTime = (new Date()).getTime();
        return session;
    }
    return null;
};

var removeSession = function (key) {
    if (allSession.hasOwnProperty(key)) {
        delete allSession[key];
    }
};

var getDataByRequest = function (request) {
    var key = request.cookies[SESSION_ID_COOKIE];
    return getSession(key);
};

module.exports.SESSION_ID_COOKIE = SESSION_ID_COOKIE;
module.exports.getDataByRequest = getDataByRequest;
module.exports.addSession = addSession;
module.exports.getSession = getSession;
module.exports.removeSession = removeSession;
module.exports.getConfirmCode = getConfirmCode;


var debug = require('debug')('VaccineForChild:session');
var crypto = require('crypto');

var KEY_LENGTH = 16;

var allSession = {};

var getKey = function () {
    var key = null;
    while (!key || allSession.hasOwnProperty(key))
        key = crypto.randomBytes(KEY_LENGTH).toString('hex');
    return key;
};

var addSession = function (data) {
    var key = getKey();
    allSession[key] = {
        key: key,
        data: data,
        creationTime: (new Date()).getTime(),
        lastAccessTime: (new Date()).getTime()
    };
    return key;
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

module.exports.addSession = addSession;
module.exports.getSession = getSession;
module.exports.removeSession = removeSession;
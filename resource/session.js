var debug = require('debug')('VaccineForChild:session');
var crypto = require('crypto');

var allSession = {};

var getId = function () {
    var id = null;
    while (allSession.hasOwnProperty(id) || !id)
        id = crypto.randomBytes(16).toString('hex');
};

var addSession = function (data, ageInMin) {
    var id = getId();
    allSession[id] = {
        key: id,
        data: data,
        creationTime: (new Date()).getTime(),
        lastAccessTime: (new Date()).getTime(),
        age: ageInMin ? ageInMin * 60000 : -1
    };
    return id;
};

var getSession = function (id) {
    if (allSession.hasOwnProperty(id)) {
        var session = allSession[id];
        var t = session.creationTime + session.age;
        if (t < (new Date()).getTime()) {
            delete allSession[id];
        }
        else {
            session.lastAccessTime = (new Date()).getTime();
            return session;
        }
    }
    return null;
};

var removeSession = function (id) {
    if (allSession.hasOwnProperty(id)) {
        delete allSession[id];
    }
};

module.exports.addSession = addSession;
module.exports.getSession = getSession;
module.exports.removeSession = removeSession;
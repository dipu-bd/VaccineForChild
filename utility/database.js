var mysql = require('mysql');
var debug = require('debug')('VaccineForChild:database');

var options = {
    connectionLimit: 100,   // important - limit the number of simultaneous connection
    host: "localhost",      // database address url
    port: "3306",   // port of the database
    user: "root",   // username
    password: "",   // password
    database: "vaccinedb",   // name of the database
    //charset: "",  // charset of the database
    debug: false    // true to show all output
};

// create a database pool to make parallel connections
var pool = mysql.createPool(options);

pool.on('error', function (err) {
    debug("!!MySQL Error: " + err.errno + " " + err.code + " " + (fatal ? "{FATAL}" : "{NOT FATAL}"));
    debug(err);
});

/**
 * Performs a sql query in the database and callback the result.
 * @param sql SQL command to execute.
 * @param callback (err, result) : if no error then error is null, otherwise result is null
 */
var runQuery = function (sql, callback) {
    debug(sql);
    pool.getConnection(function (err, connection) {
        if (err) {
            debug(err);
            callback('Failed to connect with database!');
        } else {
            connection.query(sql, function (err, res) {
                connection.release();
                callback(null, res);
            });
        }
    });
};

/**
 * Gets an user.
 * @param id ID of the user.
 * @param uname Username of the user.
 * @param email Email of the user.
 * @param callback (err, result) : if no error then error is null, otherwise result is null
 */
var getUser = function (id, uname, email, callback) {
    var insert = ['user'];
    var cnt = 0;
    if (id) {
        ++cnt;
        insert.push('id', id);
    }
    if (uname) {
        ++cnt;
        insert.push('uname', uname)
    }
    if (email) {
        ++cnt;
        insert.push('email', email);
    }

    if (cnt === 0) {
        callback("Invalid input");
        return;
    }

    var sql = "SELECT * FROM ?? WHERE ?? = ?";
    for (var i = 1; i < cnt; ++i) sql += " OR ?? = ?";
    sql = mysql.format(sql, insert);

    runQuery(sql, function (err, res) {
        if (err) {
            callback(err);
        } else if (!res || res.length === 0) {
            callback('User not found');
        }
        else {
            callback(null, res[0]);
            if (res.length > 1) {
                debug('Multiple user found. Database Error!');
            }
        }
    });
};

/**
 * Gets an user by her id.
 * @param userId ID of the user.
 * @param callback (err, result) : if no error then error is null, otherwise result is null
 */
var getUserById = function (userId, callback) {
    getUser(userId, null, null, callback);
};

/**
 * Gets an user by her name.
 * @param userName Username of the user.
 * @param callback (err, result) : if no error then error is null, otherwise result is null
 */
var getUserByName = function (userName, callback) {
    getUser(null, userName, null, callback);
};


/**
 * Gets an user by her email.
 * @param email Email of the user.
 * @param callback (err, result) : if no error then error is null, otherwise result is null
 */
var getUserByEmail = function (email, callback) {
    getUser(null, null, email, callback);
};

/**
 * Creates a new user. In callback, result =  the updated user.
 * @param uname
 * @param email
 * @param password
 * @param callback (err, result) : if no error then error is null, otherwise result is null
 */
var createUser = function (uname, email, password, callback) {
    getUser(null, uname, email, function (err, res) {
        if (res) {
            callback("Another user exists with same username or email");
        } else {
            var inserts = ['user', 'uname', 'email', 'password', uname, email, password];
            var sql = "INSERT INTO ?? (??, ??, ??) VALUES (?, ?, ?); ";
            sql = mysql.format(sql, inserts);
            runQuery(sql, function (err) {
                if (err) {
                    callback(err);
                }
                else {
                    getUserByName(uname, callback);
                }
            });
        }
    });
};

/**
 * Change password of an user
 * @param id
 * @param old
 * @param password New password
 * @param callback (err, result) => err is null if success
 */
var changePassword = function (id, old, password, callback) {
    getUserById(id, function (err, res) {
        console.log(id);
        if (err) {
            callback(err);
        }
        else if (res.password !== old) {
            callback("Invalid old password");
        }
        else {
            var sql = "UPDATE ?? SET ??=? WHERE ??=?;";
            var inserts = ['user', 'password', password, 'id', id];
            sql = mysql.format(sql, inserts);
            runQuery(sql, callback);
        }
    });
};

/**
 * Marks an email address as confirmed
 * @param email
 * @param callback
 */
var confirmEmail = function (email, callback) {
    var sql = "UPDATE ?? SET ??=? WHERE ??=?;";
    var inserts = ['user', 'confirmed', 1, 'email', email];
    sql = mysql.format(sql, inserts);
    runQuery(sql, callback);
};

/**
 * Updates an user with name or address.
 * @param name Name of the user
 * @param address Address ID to set
 * @param callback (err, res) where res = true on success.
 */
var updateUser = function (name, address, callback) {
    if (!(name || address)) {
        callback('Both fields are null');
        return;
    }

    var sql, inserts;
    if (name && address) {
        sql = "UPDATE ?? SET ??=?, ??=? WHERE ??=?;";
        inserts = ['user', 'name', name, 'address', address];
    } else if (name) {
        sql = "UPDATE ?? SET ??=? WHERE ??=?;";
        inserts = ['user', 'name', name];
    } else {
        sql = "UPDATE ?? SET ??=? WHERE ??=?;";
        inserts = ['user', 'address', address];
    }

    sql = mysql.format(sql, inserts);
    runQuery(sql, callback);
};

/**
 * Adds an address
 * @param state State name
 * @param city City name
 * @param region Region name
 * @param postcode Postal code
 * @param callback (err, res) where res = newly added address object.
 */
var createAddress = function (state, city, region, postcode, callback) {

};

/**
 * Gets an address
 * @param state State name
 * @param city City name
 * @param region Region name
 * @param postcode Postal code
 * @param callback (err, res) where res = address object or null if none.
 */
var getAddress = function (state, city, region, postcode, callback) {

};

/**
 * Retrieve the list of phone numbers of an user.
 * @param user ID of the user
 * @param callback (err, res) where res=list of objects
 */
var getPhones = function (user, callback) {

};

/**
 * Add a phone number to an user. Number must be verified before adding.
 * @param user ID of the user
 * @param number Phone number to add
 * @param callback (err, res) where res = newly added phone object.
 */
var createPhone = function (user, number, callback) {

};

/**
 * Removes a phone number.
 * @param id ID of the phone
 * @param callback (err) => if no error, err=null
 */
var removePhone = function (id, callback) {

};

/**
 * Creates a new user
 * @param dob Date of birth
 * @param user ID of user this child belongs to
 * @param name Name of the child
 * @param height Height of the child
 * @param weight Weight of the child
 * @param address Address id of the child
 * @param callback (err, res) => res = newly created child object
 */
var createChild = function (dob, user, name, height, weight, address, callback) {

};

/**
 * Gets all child under the user
 * @param id ID of the user
 * @param callback (err, res) => array of child objects
 */
var getAllChilds = function (id, callback) {

};

/**
 * Creates a vaccine.
 * @param title Name of the vaccine.
 * @param callback (err, res)=> res = newly created vaccine object.
 */
var createVaccine = function (title, callback) {

};

/**
 * Gets a list of all vaccines.
 * @param callback (err, res)=> res = list of all vaccine object.
 */
var getVaccines = function (callback) {

};


/**
 * Creates a dose for vaccine.
 * @param vaccine ID of the vaccine.
 * @param dab when to apply the vaccine in days after birth.
 * @param callback (err, res)=> res = newly created vaccine object.
 */
var createDose = function (vaccine, dab, callback) {

};

/**
 * Gets a list of all doses of a vaccine.
 * @param vaccine ID of the vaccine.
 * @param callback (err, res)=> res = list of all dose object.
 */
var getDoses = function (vaccine, callback) {

};

/**
 * Gets a list of (phone_id, child_id, dose_id) object of children who needs vaccines.
 * @param callback (err, res) => res = list of object containing above information.
 */
var childNeededVaccines = function (callback) {

};

module.exports.getUserById = getUserById;
module.exports.getUserByName = getUserByName;
module.exports.getUserByEmail = getUserByEmail;
module.exports.createUser = createUser;
module.exports.confirmEmail = confirmEmail;
module.exports.changePassword = changePassword;
module.exports.getPhones = getPhones;
module.exports.createPhone = createPhone;
module.exports.removePhone = removePhone;
module.exports.createAddress = createAddress;
module.exports.getAddress = getAddress;
module.exports.updateUser = updateUser;
module.exports.createChild = createChild;
module.exports.getAllChilds = getAllChilds;
module.exports.createVaccine = createVaccine;
module.exports.getVaccines = getVaccines;
module.exports.createDose = createDose;
module.exports.childNeededVaccines = childNeededVaccines;

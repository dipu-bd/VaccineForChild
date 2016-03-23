var debug = require('debug')('VaccineForChild:database');
var mysql = require('mysql');

var options = {
    connectionLimit: 100,   // important - limit the number of simultaneous connection
    host: "localhost",      // database address url
    port: "3306",   // port of the database
    user: "root",   // username
    password: "",   // password
    database: "vaccinedb",   // name of the database
    debug: false    // true to show all outputs
};

// create a database pool to make parallel connections
var pool = mysql.createPool(options);

pool.on('error', function (err) {
    debug("MySQL Error: " + err.errno + " " + err.code + " " + (err.fatal ? "{FATAL}" : "{NOT FATAL}"));
    //debug(err);
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
            //debug(err);
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
        callback("No user found");
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
                debug('Multiple user found. Query Error!');
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
 * @param name
 * @param callback (err, result) : if no error then error is null, otherwise result is null
 */
var createUser = function (uname, email, password, name, callback) {
    var sql, inserts;
    sql = "SELECT * FROM ?? WHERE ??=? OR ??=?";
    inserts = ['user', 'uname', uname, 'email', email];
    sql = mysql.format(sql, inserts);
    runQuery(sql, function (err, res) {
        if (res && res.length > 0) {

            if (res.length == 1) {
                if (res[0].uname == uname)
                    callback("Another user exists with same user-name");
                else
                    callback("Another user exists with same email");
            }
            else {

                callback("Multiple user exists with same user-name and email");
            }

        } else {
            sql = "INSERT INTO ?? (??, ??, ??, ??) VALUES (?, ?, ?, ?); ";
            inserts = ['user', 'uname', 'email', 'password', 'name', uname, email, password, name];
            sql = mysql.format(sql, inserts);
            runQuery(sql, function (err2) {
                if (err2) {
                    callback(err2);
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
 * Updates an user with name or address.
 * @param user User object to update
 * @param callback (err, res) where res = true on success.
 */
var updateUser = function (user, callback) {
    getUserByEmail(user.email || "", function (err, result) {
        if (result && result.length > 0 && result.id != user.id) {
            callback("Another user exists with same email!");
        }
        else {
            var data = {};
            if (user.hasOwnProperty('email'))
                data.email = user.email;
            if (user.hasOwnProperty('name'))
                data.name = user.name;
            if (user.hasOwnProperty('address'))
                data.address = user.address;
            if (user.hasOwnProperty('confirmed'))
                data.confirmed = user.confirmed;
            if (user.hasOwnProperty('phone'))
                data.phone = user.phone;
            if (user.hasOwnProperty('access'))
                data.access = user.access;

            if (Object.keys(data).length == 0) {
                callback('Nothing changed!');
                return;
            }

            var sql = "UPDATE ?? SET ? WHERE ??=?;";
            var insert = ['user', data, 'id', user.id];
            sql = mysql.format(sql, insert);

            runQuery(sql, function (err, res) {
                if (err) {
                    callback(err);
                }
                else {
                    getUserById(user.id, callback);
                }
            });
        }
    });
};

/**
 * Delete an user
 * @param id ID of the user
 * @param callback
 */
var deleteUser = function (id, callback) {
    var sql = "DELETE FROM ?? WHERE ?? = ?";
    var selects = ['user', 'id', id];
    sql = mysql.format(sql, selects);
    runQuery(sql, callback);
};

/**
 * Creates a new child
 * @param user ID of user this child belongs to
 * @param name Name of the child
 * @param dob Date of birth
 * @param height Height of the child
 * @param weight Weight of the child
 * @param gender Gender of the child
 * @param callback (err, res) => res = newly created child object
 */
var createChild = function (user, name, dob, height, weight, gender, callback) {
    getChildByName(user, name, function (err, data) {
        if (data && data.length > 0) {
            callback("This child has already been added");
        }
        else {
            var sql, inserts;
            sql = "INSERT INTO ?? (??,??,??,??,??,??) VALUES (?,?,?,?,?,?)";
            inserts = ['child', 'user', 'name', 'dob', 'height', 'weight', 'gender',
                user, name, dob, height, weight, gender];
            sql = mysql.format(sql, inserts);
            runQuery(sql, function (err, result) {
                if (err) {
                    callback(err);
                } else {
                    getChildByName(user, name, callback);
                }
            });
        }
    });
};

/**
 * Delete a child
 * @param id ID of the child
 * @param callback
 */
var deleteChild = function (id, callback) {
    var sql = "DELETE FROM ?? WHERE ?? = ?";
    var selects = ['child', 'id', id];
    sql = mysql.format(sql, selects);
    runQuery(sql, callback);
};

/**
 * Updates a child
 * @param child Child object
 * @param callback
 */
var updateChild = function (child, callback) {
    getChildByName(child.user, child.name, function (err, result) {
        if (result && result.length > 0 && child.id != result.id) {
            callback("Another child exists with same name");
        }
        else {
            var data = {};
            if (child.name) data.name = child.name;
            if (child.dob) data.dob = child.dob;
            if (child.height) data.height = child.height;
            if (child.weight) data.weight = child.weight;
            if (child.gender) data.gender = child.gender;

            if (Object.keys(data).length == 0) {
                callback('Nothing changed!');
                return;
            }

            var sql = "UPDATE ?? SET ? WHERE ??=?;";
            var insert = ['child', data, 'id', child.id];
            sql = mysql.format(sql, insert);

            // update child
            runQuery(sql, function (err, res) {
                if (err) {
                    callback(err);
                }
                else {
                    // get updated child and return
                    getChildById(child.id, callback);
                }
            });
        }
    });
};

/**
 * Gets all child under the user
 * @param callback (err, res) => array of child objects
 */
var getAllChildren = function (callback) {
    var sql, selects;
    sql = "SELECT * FROM ??";
    selects = ['child', 'user',];
    sql = mysql.format(sql, selects);
    runQuery(sql, callback);
};


/**
 * Gets all child under the user
 * @param id ID of the user
 * @param callback (err, res) => array of child objects
 */
var getChildrenOf = function (id, callback) {
    var sql, selects;
    sql = "SELECT * FROM ?? WHERE ?? = ?";
    selects = ['child', 'user', id];
    sql = mysql.format(sql, selects);
    runQuery(sql, callback);
};

/**
 * Gets a child by id
 * @param id ID of the child
 * @param callback (err, res) => array of child objects
 */
var getChildById = function (id, callback) {
    var sql = "SELECT * FROM ?? WHERE ??=?";
    var insert = ['child', 'id', id];
    sql = mysql.format(sql, insert);
    runQuery(sql, callback);
};

/**
 * Gets a child by id
 * @param user User ID of the child
 * @param name Name of the child
 * @param callback (err, res) => array of child objects
 */
var getChildByName = function (user, name, callback) {
    var sql = "SELECT * FROM ?? WHERE ??=? AND ??=?";
    var insert = ['child', 'user', user, 'name', name];
    sql = mysql.format(sql, insert);
    runQuery(sql, callback);
};

/**
 * Creates a vaccine.
 * @param title Name of the vaccine.
 * @param callback (err, res)=> res = newly created vaccine object.
 */
var createVaccine = function (title, callback) {
    getVaccine(title, function (err, res) {
        if (res && res.length > 0) {
            callback("Vaccine has already been added!");
        }
        else {
            var sql = "INSERT INTO ?? (??) VALUES(?)";
            var inserts = ['vaccine', 'title', title];
            sql = mysql.format(sql, inserts);
            runQuery(sql, callback);
        }
    })
};


/**
 * Delete the vaccine
 * @param id ID of the vaccine
 * @param callback
 */
var deleteVaccine = function (id, callback) {
    var sql = "DELETE FROM ?? WHERE ?? = ?";
    var selects = ['vaccine', 'id', id];
    sql = mysql.format(sql, selects);
    runQuery(sql, callback);
};


/**
 * Updates a vaccine.
 * @param vac Updated vaccine data
 * @param callback (err, res)=> res = newly created vaccine object.
 */
var updateVaccine = function (vac, callback) {
    getVaccine(vac.title, function (err, res) {
        if (res && res.length > 0 && res.id != vac.id) {
            callback("Vaccine with similar name already exists!");
        }
        else {
            var data = {};
            if (vac.title) data.title = vac.title;

            var sql = "UPDATE ?? SET ? WHERE ??=?";
            var inserts = ['vaccine', data, 'id', vac.id];
            sql = mysql.format(sql, inserts);
            runQuery(sql, callback);
        }
    })
};

/**
 * Gets a list of all vaccines.
 * @param title Title of the vaccine.
 * @param callback (err, res)=> res = list of all vaccine object.
 */
var getVaccine = function (title, callback) {
    var sql = "SELECT * FROM ?? WHERE ?? = ?";
    var inserts = ['vaccine', 'title', title];
    sql = mysql.format(sql, inserts);
    runQuery(sql, callback);
};


/**
 * Gets a list of all vaccines.
 * @param callback (err, res)=> res = list of all vaccine object.
 */
var getAllUsers = function (callback) {
    var sql = "SELECT * FROM ??";
    var inserts = ['user'];
    sql = mysql.format(sql, inserts);
    runQuery(sql, callback);
};


/**
 * Gets a list of all vaccines.
 * @param callback (err, res)=> res = list of all vaccine object.
 */
var getAllVaccines = function (callback) {
    var sql = "SELECT * FROM ??";
    var inserts = ['vaccine'];
    sql = mysql.format(sql, inserts);
    runQuery(sql, callback);
};


/**
 * Creates a dose for vaccine.
 * @param vaccine ID of the vaccine.
 * @param name Name of the vaccine.
 * @param dab when to apply the vaccine in days after birth.
 * @param callback (err, res)=> res = newly created vaccine object.
 */
var createDose = function (vaccine, name, dab, callback) {
    getDose(dab, name, vaccine, function (err, data) {
        if (data && data.length > 0) {
            callback("Dose is already added");
        }
        else {
            var sql = "INSERT INTO ?? (??, ??, ??) VALUES(?, ?, ?)";
            var inserts = ['dose', 'dab', 'name', 'vaccine', dab, name, vaccine];
            sql = mysql.format(sql, inserts);
            runQuery(sql, callback);
        }
    });
};


/**
 * Delete the dose
 * @param id ID of the dose
 * @param callback
 */
var deleteDose = function (id, callback) {
    var sql = "DELETE FROM ?? WHERE ?? = ?";
    var selects = ['dose', 'id', id];
    sql = mysql.format(sql, selects);
    runQuery(sql, callback);
};

var getDose = function (dab, name, vaccine, callback) {
    var sql = "SELECT * FROM ?? WHERE (?? = ? or ?? = ?) and ?? = ?";
    var inserts = ['dose', 'dab', dab, 'name', name, 'vaccine', vaccine];
    sql = mysql.format(sql, inserts);
    runQuery(sql, callback);
};

var updateDose = function (dose, callback) {
    getDose(dose.dab, dose.name, dose.vaccine, function (err, result) {
        if (result && result.length > 0 && result[0].id != dose.id) {
            callback('Similar dose already exists!');
        }
        else {
            var data = {};
            if (dose.dab) data.dab = dose.dab;
            if (dose.name) data.name = dose.name;

            var sql = "UPDATE ?? SET ? WHERE ?? = ?";
            var inserts = ['dose', data, 'id', dose.id];
            sql = mysql.format(sql, inserts);
            runQuery(sql, callback);

        }
    });
};

/**
 * Gets a list of all doses.
 * @param callback (err, res)=> res = list of all dose object.
 */
var getAllDoses = function (callback) {
    var sql =
        "SELECT dose.id, dose.vaccine, vaccine.title, dose.name, dose.dab " +
        "FROM dose JOIN vaccine WHERE vaccine.id = dose.vaccine ORDER BY dose.dab";
    runQuery(sql, callback);
};


/**
 * Gets a list of all doses of a vaccine.
 * @param vaccine Vaccine id of the vaccine.
 * @param callback (err, res)=> res = list of all dose object.
 */
var getDosesOfVaccine = function (vaccine, callback) {
    var sql = "SELECT * FROM ?? WHERE ??=? ORDER BY ??";
    var inserts = ['dose', 'vaccine', vaccine, 'dab'];
    sql = mysql.format(sql, inserts);
    runQuery(sql, callback);
};

var setTaken = function (child, dose) {
    var sql = "SELECT * FROM `taken` WHERE `child`=? AND `dose`=?";
    var inserts = [child, dose];
    runQuery(mysql.format(sql, inserts), function (err, data) {
        if (data && data.length == 0) {
            sql = "INSERT INTO `taken` (`child`, `dose`) VALUES (?, ?)";
            runQuery(mysql.format(sql, inserts), callback);
        }
    });

};

var getTakens = function (user, callback) {
    var sql = "SELECT * FROM ?? WHERE ?? IN (SELECT ?? FROM ?? WHERE ??=?)";
    var inserts = ['taken', 'child', 'id', 'child', 'user', user];
    runQuery(mysql.format(sql, inserts), callback);
};

module.exports.runQuery = runQuery;
module.exports.getUserById = getUserById;
module.exports.getUserByName = getUserByName;
module.exports.getUserByEmail = getUserByEmail;
module.exports.createUser = createUser;
module.exports.deleteUser = deleteUser;
module.exports.changePassword = changePassword;
module.exports.deleteChild = deleteChild;
module.exports.deleteDose = deleteDose;
module.exports.deleteVaccine = deleteVaccine;
module.exports.updateUser = updateUser;
module.exports.createChild = createChild;
module.exports.getALlChildren = getAllChildren;
module.exports.getChildrenOf = getChildrenOf;
module.exports.getChild = getChildById;
module.exports.updateChild = updateChild;
module.exports.updateVaccine = updateVaccine;
module.exports.createVaccine = createVaccine;
module.exports.getVaccine = getVaccine;
module.exports.getAllVaccines = getAllVaccines;
module.exports.getAllUsers = getAllUsers;
module.exports.getDose = getDose;
module.exports.createDose = createDose;
module.exports.updateDose = updateDose;
module.exports.getAllDoses = getAllDoses;
module.exports.getDosesOfVaccine = getDosesOfVaccine;
module.exports.setTaken = setTaken;
module.exports.getTakens = getTakens;

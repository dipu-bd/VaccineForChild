var mysql = require('mysql');

var options = {
    connectionLimit: 50, // important - limit the number of simultaneous connection
    host: "localhost", // database address url
    port: "3306", // port of the database
    database: "VaccineDB", // name of the database
    user: "root", // username
    password: "", // password
    debug: false // true to show all output
};

// create a database pool to make parallel connections
var pool = mysql.createPool(options);

pool.on('error', function (err) {
    debug("!!MySQL Error: " + err.errno + " " + err.code + " " + (fatal ? "{FATAL}" : "{NOT FATAL}") + "!!");
    debug(err);
});

/**
 * Performs a sql query in the database and callback the result.
 * @param sql
 * @param callback (err, result) : if no error then error is null, otherwise result is null
 */
var runQuery = function (sql, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            callback(err);
        } else {
            connection.query(sql, function (err, res) {
                connection.release();
                callback(null, res);
            });
        }
    });
};

/**
 * Gets a user by user-id, null otherwise.
 * @param userid
 * @param callback (err, result) : if no error, error is null; otherwise result is null.
 */
var getUser = function (userid, callback) {
    var sql = "SELECT * FROM ?? WHERE ?? = ?";
    var inserts = ['user', 'id', userid];
    sql = mysql.format(sql, inserts);
    runQuery(sql, function (err, res) {
        if (err) {
            callback(err);
        } else if (res.length === 0) {
            callback("Not found");
        }
        else {
            callback(null, res[0]);
        }
    });
};

/**
 * Adds a new student to the database. In callback, result =  the updated student object.
 * @param student_name
 * @param regno
 * @param cgpa
 * @param callback (err, result) : if no error then error is null, otherwise result is null
 */
var addStudent = function (student_name, regno, cgpa, callback) {
    getStudent(regno, function (err, res) {
        if (res) {
            callback("Another student with same registration number already exists", null);
        } else {
            var sql = "INSERT INTO ?? (??, ??, ??) VALUES (?, ?, ?); ";
            var inserts = ['student', 'student_name', 'regno', 'cgpa', student_name, regno, cgpa];
            sql = mysql.format(sql, inserts);
            runQuery(sql, function (err) {
                if (err) {
                    callback(err);
                }
                else {
                    getStudent(regno, callback);

                }
            });
        }
    });
};

/**
 * Updates a students information. In callback, result =  the updated student object.
 * @param student_id
 * @param student_name
 * @param regno
 * @param cgpa
 * @param callback (err, result) : if no error then error is null, otherwise result is null
 */
var updateStudent = function (student_id, student_name, regno, cgpa, callback) {
    getStudent(regno, function (err, res) {
        if (res && res.student_id != student_id) {
            callback("Another student with same registration number already exists", null);
        } else {
            var sql = "UPDATE ?? SET ??=?, ??=?, ??=? WHERE ??=?;";
            var inserts = ['student', 'student_name', student_name, 'regno', regno, 'cgpa', cgpa, 'student_id', student_id];
            sql = mysql.format(sql, inserts);
            runQuery(sql, function (err) {
                if (err) {
                    callback(err);
                }
                else {
                    getStudent(regno, callback);
                }
            });
        }
    });
};


/**
 * Deletes a students information permanently. In callback, result =  the updated student object.
 * @param student_id
 * @param callback (err, result) : if no error then error is null, otherwise result is null
 */
var deleteStudent = function (student_id, callback) {
    var sql = "DELETE FROM ?? WHERE ??=?;";
    var inserts = ['student', 'student_id', student_id];
    sql = mysql.format(sql, inserts);
    runQuery(sql, function (err) {
        if (err) {
            callback(err);
        }
        else {
            callback(null, true);
        }
    });
};

var allStudents = function (callback) {
    var sql = "SELECT * FROM ??";
    var inserts = ['student'];
    sql = mysql.format(sql, inserts);
    runQuery(sql, callback);
};

module.exports.runQuery = runQuery;
module.exports.getUser = getUser;
module.exports.addStudent = addStudent;
module.exports.updateStudent = updateStudent;
module.exports.deleteStudent = deleteStudent;
module.exports.allStudents = allStudents;

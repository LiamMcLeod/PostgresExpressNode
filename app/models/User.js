var lib = require('./../modules/lib');
var bcrypt = require('bcrypt-nodejs');
var pg = require('pg');

/*
 * Object Constructor
 */
function User() {
    this.UserId = -1;
    this.EmailAddress = '';
    this.Password = '';
    this.Created = '';
    this.FirstName = '';
    this.OtherName = '';
    this.LastName = '';
    this.Title = '';
    this.DateOfBirth = '';
    this.Role = '';
    this.PostNominal = '';
    this.Username = '';
}

/*
 * Hash password in pass propery of object {o}
 * @param o Object
 */
User.prototype.hash = function (o) {
    var salt = bcrypt.genSaltSync(8);
    return bcrypt.hashSync(o.pass, salt)
};

/*
 * validate pass property of object {o}
 * against user password property
 * @param o Object
 * @param callback function(err, valid)
 */
User.prototype.validate = function (o, callback) {
    callback(bcrypt.compareSync(o.pass, User.Password));
};

User.prototype.findAll = function () {

};
User.prototype.findOne = function (o) {

};

/*
 * Find user in database with object from form {object}
 * populate object with user data for later interrogation
 * @param o Object
 * @param callback function(err, user)
 */
User.prototype.findUser = function (o, callback) {
    var error;
    var results = [];
    var query = {};

    if (o.user.contains('.ac.uk') || o.user.contains('.co.uk') || o.user.contains('.com') && o.user.contains('@')) {
        query = {
            text: 'SELECT * from "User" WHERE "EmailAddress"=$1',
            values: [o.user.toLowerCase()]
        }
    } else {
        query = {
            text: 'SELECT * from "User" WHERE "Username"=$1 LIMIT 1',
            values: [o.user]
        };
    }

    pg.connect(process.env.DATABASE_URL, function (err, client, done) {
        /* if Connection Callback Error */
        if (err) {
            console.log(err);
        }
        /* Client runs query */
        var q = client.query(query, function (err, result) {
            /* Client Q has error */
            if (err) throw err;
            else return result;
        });
        /* Client Q has row */
        q.on('row', function (row, result) {
            results.push(row);
            result.addRow(row);
        });
        /* Client Q has finished */
        q.on('end', function (result) {
            done();
            var found = false;
            if (result.rows[0] != undefined) {
                setResults(result);
                found = true;
            }
            else found = false;
            callback(error, found, result.rows[0]);
        });
    });
};

/*
 * populate User object with query data {results}
 * @param results Object
 */
setResults = function (results) {
    set("UserId", results.rows[0].UserId);
    set("EmailAddress", results.rows[0].EmailAddress);
    set("Password", results.rows[0].Password);
    set("Created", results.rows[0].Created);
    set("OtherNames", results.rows[0].OtherName);
    set("LastName", results.rows[0].LastName);
    set("Title", results.rows[0].Title);
    set("DateOfBirth", results.rows[0].DateOfBirth);
    set("Role", results.rows[0].Role);
    set("Username", results.rows[0].Username);
    set("FirstName", results.rows[0].FirstName);
    // if (results.rows[0].PostNominal!='undefined')
    set("PostNominal", results.rows[0].PostNominal);
};

/*
 * Returns the data in
 * current instance of user
 */
User.prototype.getResults = function () {
    return User;
};
/*
 * find by Id function
 * TODO FINISH
 * @param o Object
 */
User.prototype.findbyId = function (id) {
    query = {
        text: 'SELECT * FROM "User" WHERE "UserId"=$1',
        values: [id]
    };
};
/*
 * find by {what} function
 * TODO FINISH
 * @param o Object
 */
User.prototype.find = function (where, op, what) {
    query = {
        text: 'SELECT * FROM "User" WHERE $1 $2 $3',
        values: [where, op, what]
    };
};

/*
 * sets {property} of user
 * to {values} provided
 * @param prop String
 * @param val Type
 */
function set(prop, val) {
    User[prop] = val;
}

/*
 * gets {property} of user
 * to {values} provided
 * @param prop String
 */
function get(prop) {
    return User[prop];
}

/*
 * get {user} and populate object with user
 * for rendering of their profile
 * @param o Object
 */
User.prototype.getUser = function (o) {
    var results = [];
    var query = {
        text: 'SELECT * from "User" WHERE "Username"=$1 LIMIT 1',
        values: [o.user]
    };

    pg.connect(process.env.DATABASE_URL, function (err, client, done) {
        /* if Connection Callback Error */
        if (err) {
            console.log(err);
        }
        /* CLient runs query */
        var q = client.query(query, function (err, result) {
            /* Client Q has error */
            if (err) throw err;
            else return result;
        });
        /* Client Q has row */
        q.on('row', function (row, result) {
            results.push(row);
            result.addRow(row);
        });
        /* Client Q has finished */
        q.on('end', function (result) {
            done();
            var found = false;
            if (result.rows[0] != undefined) {
                setResults(result);
                found = true;
            }
            else found = false;
            callback(error, found, result.rows[0]);
        });
    });
};

module.exports = User;
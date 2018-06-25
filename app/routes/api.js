var mod = require('../modules/routeModules');
var lib = require('../modules/lib');
var User = require('../models/User');
// DEBUG STRING     console.log(req.method +" " + req.url + " from address " + req.connection.remoteAddress);

module.exports = function (express, client) {

    var apiRouter = express.Router();


    // /**
    //  * GET
    //  * /api+'/'
    //  * Returns API version and other data
    //  */
    apiRouter.get('/', function (req, res) {
        var results = {};
        var param = {};
        param = mod.checkParams(req, res);
        results = {
            title: "API Version 0.0.1",
            properties: {options: "/"}
        };
        mod.returnJSON(res, results, param);
    });




    /* Defaults */
    /**
     * GET
     * /api+'/user'
     * Returns User JSON DATA
     *  TODO Finish or scrap
     *  RESTFUL Profile Generation?
     */
    apiRouter.get('/user', function (req, res) {
        var results;
        var param = mod.checkParams(req, res);
        mod.returnJSON(res, results, param);
    });

    /**
     * GET
     * /api+'/logout'
     * Destroys user session data
     * Redirects them to index
     */
    apiRouter.get('/logout', function (req, res) {
        req.session.destroy();
        //TODO Cookie stuff
        // res.clearCookie('connect.sid');
        res.redirect('/', 303, function (err) {
            if (err) mod.error(req, res, err);
        })
    });

    /**
     * POST
     * /api+'/login'
     * Instantiates user to interrogate database
     * verifying credentials provided
     */
    apiRouter.post('/login', function (req, res) {
        //TODO Server Side Validation
        var user = new User();
        var o = {};
        //TODO logic for checkbox
        if (!req.body.username || typeof req.body.username === 'undefined' || req.body.username === null || req.body.username === '') {
            req.session.loggedIn = false;
            req.flash('status', 'Username empty.');
            res.redirect(303, '/user');
        } else {
            o.user = req.body.username;
        }
        if (!req.body.password || typeof req.body.password === 'undefined' || req.body.password === null || req.body.password === '') {
            req.session.loggedIn = false;
            req.flash('status', 'Password empty.');
            res.redirect(303, '/user');
        }
        else {
            o.pass = req.body.password;
        }
        // o.exists = user.findUser(o);
        user.findUser(o, function (err, found, userData) {
            if (err) throw err;
            if (found) {
                user.validate(o, function (valid) {
                    if (valid) {
                        var obj = {};
                        for (var key in userData) {
                            if (lib.isset(userData[key]) && userData[key] != null) {
                                if (userData[key].trim) {
                                    userData[key] = userData[key].trim();
                                }
                            }
                        }

                        userData.Created = userData.Created.toString();
                        userData.DateOfBirth = userData.DateOfBirth.toString();

                        req.session.loggedIn = true;
                        req.session.user = userData;
                        req.flash('status', 'Success!');
                        res.redirect(302, '/user');
                    } else {
                        req.session.loggedIn = false;
                        req.flash('status', 'Incorrect password.');
                        res.redirect(303, '/user');
                        // mod.returnJSON(res, {success: false, message: "Password incorrect"})
                    }
                })
            }
            else {
                req.session.loggedIn = false;
                req.flash('status', 'Incorrect username.');
                res.redirect(303, '/user');
                // mod.returnJSON(res, {success: false, message: "Username does not exist"})
            }
        });
    });

    /**
     * POST
     * /api+'/edit/user'
     * Retrieves and changes made to user data
     */
    apiRouter.post('/edit/user', function (req, res) {
        //TODO Finish this route
        //TODO Server side validation for data and user role.
        var o = req.body();
        req.send(o)
    });

    /**
     * GET
     * /api+'/*'
     * Catch all 404 fallback
     */
    apiRouter.get('/*', function (req, res) {
        mod.returnJSON(res);
    });
    return apiRouter;
};

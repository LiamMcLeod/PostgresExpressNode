var mod = require('../modules/routeModules');
var lib = require('../modules/lib');
var User = require('../models/User');

module.exports = function (express) {
    var appRouter = express.Router();

    /*
     * GET
     * '/'
     * Delivers index
     *
     */
     appRouter.get('/', function(req, res){

   		var getReq  = req.query['q'];
   		console.log(getReq);

   		res.render('index',{
   			getReq: getReq
   		});
   	});

    /*
     * GET
     * '/'
     * Delivers file
     *
     */
	appRouter.get('/:file', function (req, res) {

		var file = req.params.file;
		var getReq='', idReq='';
		if (file === "home" || file==="Home" || file=="index" || file==="index") {
			file = "index";

			res.render(file, {

			}, function(err, result) {
				if (err) mod.error(req, res, err) ;
				else res.send(result);
			});
		}
		if (file==="result"){
			res.render(file, {
			}, function(err, result) {
				if (err) mod.error(req, res, err) ;
				else res.send(result);
			});
		}
		else {
        res.render(file, {
        }, function(err, result) {
            if (err) mod.error(req, res, err) ;
            else res.send(result);
        });
		}
	});

    appRouter.get('/*', function (req, res) {
        res.render("index", {

        }, function(err, result) {
            if (err) mod.error(req, res, err) ;
            else res.send(result);
        });
    });

	return appRouter;

};

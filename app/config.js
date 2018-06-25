/**
 * Created by dual1ty on 22/02/2016.
 */

var config = {};

config.dir = {};
                        // example of dirs
    config.dir.root     = appRoot;
    config.dir.views    = appRoot+'/views';
    config.dir.public   = appRoot+'/public';
    config.dir.favicon  = config.dir.public+    '/favicon';
    config.dir.js       = config.dir.public+    '/js';
    config.dir.libs     = config.dir.public + '/libs';
    config.dir.css      = config.dir.public+    '/css';
    config.dir.img      = config.dir.public+    '/img';
    config.dir.files    = config.dir.public+    '/files';

config.db = {};
if (process.env.NODE_ENV) {
    var db = process.env.DATABASE_URL;
    config.db.url = db;
    var t = db.indexOf('//') + 2;               // Postgress://
    var u = db.indexOf(':', t);                 // Username
    var v = db.indexOf('@');                    // Pass
    var w = db.indexOf(':', v);                 // host
    var x = db.indexOf('/', w);                 // pass
    var y = db.indexOf('?', x);                 // tablename
    var z = db.length;                          // queries
    config.db.dbms = db.substring(0, t);
    config.db.user = db.substring(t, u);
    config.db.pass = db.substring(u + 1, v);
    config.db.host = db.substring(v + 1, w);
    config.db.port = db.substring(w + 1, x);
    config.db.base = db.substring(x + 1, y);
    config.db.query = db.substring(y, z);
  }
    else {
      // Warning Case Sensitive
    config.db.dbms  =   'postgres://';
    config.db.host  =   'localhost';
    config.db.port  =   '5432'; //3306 MySQL //27017 MongoDB //5432 Postgres
    config.db.user  =   'postgres';
    config.db.pass  =   ''; // "", root, toor.
    config.db.base  =   'examDB';
    config.db.dbms+config.db.user+':'+config.db.pass+'@'+config.db.host+':'+config.db.port+'/'+config.db.base;
  }

    config.port = {};
    // Default ports
    config.port.default = process.env.PORT || 8080 || 80;
    config.port.alternate = 3000;

    config.secret = 'dvorak';

module.exports = config;

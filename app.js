
/**
 * Module dependencies.
 */

var media_dir='/Volumes/Drobo/Media';
var tv_dir=media_dir + '/TV Shows';
var express = require('express');
var fs=require('fs');

var app = module.exports = express.createServer();

global.tv_shows=[];

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.logger());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'lemurch33ze' }));
  app.use(express.compiler({ src: __dirname + '/public', enable: ['less'] }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', express.static('/Users/plambert/Sites/plambert.net', { enable: ['less'], maxAge: 30000 })
  // function(req, res){
  //   res.render('index', {
  //     title: 'plambert.net'
  //   });
  // }
);

app.get(
  '/Media/TV%20Shows/',
  function(req, res, next) {
    fs.readdir(tv_dir, function(err, entries) {
      var locals;
      if (global.tv_shows.length == 0) {
        entries.forEach(function(entry) {
          console.log("+ " + entry);
          var entry_stat=fs.stat(tv_dir + "/" + entry);
          if (entry_stat && entry_stat.isDirectory() && ! entry.match(/^\./)) {
            global.tv_shows.push(entry);
          }
        });
      }
      res.render('tv_index', {
        title: 'plambert.net | Media | TV Shows',
        tv_shows: global.tv_shows,
        foo: "cheese"
      });
    });
  }
);

// Only listen on $ node app.js

if (!module.parent) {
  app.listen(3000);
  console.log("Express server listening on port %d", app.address().port);
}

#!/usr/bin/env node

/**
 * term.js
 * Copyright (c) 2012-2013, Christopher Jeffrey (MIT License)
 */

var http = require('http')
  , express = require('express')
  , io = require('socket.io')
  , pty = require('pty.js')
  , terminal = require('../');

var HOME = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
HOME = "/tmp";
/**
 * term.js
 */

process.title = '--term.js--';

/**
 * Dump
 */

var stream;
if (process.argv[2] === '--dump') {
  stream = require('fs').createWriteStream(__dirname + '/dump.log');
}

/**
 * Open Terminal
 */

var buff = []
  , socket
  , term;

term = pty.fork(process.env.SHELL || 'sh', [], {
  name: require('fs').existsSync('/usr/share/terminfo/x/xterm-256color')
    ? 'xterm-256color'
    : 'xterm',
  cols: 80,
  rows: 24,
  cwd: process.env.HOME
});

term.on('data', function(data) {
  if (stream) stream.write('OUT: ' + data + '\n-\n');
  return !socket
    ? buff.push(data)
    : socket.emit('data', data);
});

console.log('' + 'Created shell with pty master/slave' + ' pair (master: %d, pid: %d)', term.fd, term.pid);

var STRING = require('string');
var mmm = require('mmmagic'),
    Magic = mmm.Magic;
var magic = new Magic(mmm.MAGIC_MIME_TYPE);
var getMime = function isLoadable(filepath, callback) {
    magic.detectFile(filepath , function(err, type) {
        if( STRING(type).contains( 'text' ) ){
            type = 'T';
        }else if ( STRING(type).contains( 'inode' ) ){
            type = 'T';
        }else if ( STRING(type).contains( 'open' ) ){
            type = 'F';
        }else if ( STRING(type).contains( 'json' ) ){
            type = 'T';
        }else if ( STRING(type).contains( 'script' ) ){
            type = 'T';
        }else if ( STRING(type).contains( 'xml' ) ){
            type = 'T';
        }else if ( STRING(type).contains( 'x-tex' ) ){
            type = 'T';
        }else if ( STRING(type).contains( 'plain' ) ){
            type = 'T';
        }else if ( STRING(type).contains( 'binary' ) ){
            type = 'F';
        }else if ( STRING(type).contains( 'zip' ) ){
            type = 'F';
        }else if ( STRING(type).contains( 'excel' ) ){
            type = 'F';
        }else if ( STRING(type).contains( 'project' ) ){
            type = 'F';
        }else if ( STRING(type).contains( 'chemical' ) ){
            type = 'F';
        }else if ( STRING(type).contains( 'word' ) ){
            type = 'F';
        }else if ( STRING(type).contains( 'world' ) ){
            type = 'F';
        }else if ( STRING(type).contains( 'koan' ) ){
            type = 'F';
        }else if ( STRING(type).contains( 'powerpoint' ) ){
            type = 'F';
        }else if ( STRING(type).contains( 'octet-stream' ) ){
            type = 'F';
        }else if ( STRING(type).contains( 'project' ) ){
            type = 'F';
        }else if ( STRING(type).contains( 'fractals' ) ){
            type = 'F';
        }else if ( STRING(type).contains( 'class' ) ){
            type = 'F';
        }else if ( STRING(type).contains( 'tar' ) ){
            type = 'F';
        }else if ( STRING(type).contains( 'book' ) ){
            type = 'F';
        }else if ( STRING(type).contains( 'binhex' ) ){
            type = 'F';
        }else if ( STRING(type).contains( 'model' ) ){
            type = 'F';
        }else if ( STRING(type).contains( 'hlp' ) ){
            type = 'F';
        }else if ( STRING(type).contains( 'help' ) ){
            type = 'F';
        }else if ( STRING(type).contains( 'compressed' ) ){
            type = 'F';
        }else if ( STRING(type).contains( 'visio' ) ){
            type = 'F';
        }else if ( STRING(type).contains( 'movie' ) ){
            type = 'F';
        }else if ( STRING(type).contains( 'flash' ) ){
            type = 'F';
        }else if ( STRING(type).contains( 'music' ) ){
            type = 'F';
        }else if ( STRING(type).contains( 'media' ) ){
            type = 'F';
        }else if ( STRING(type).contains( 'image' ) ){
            type = 'F';
        }else if ( STRING(type).contains( 'audio' ) ){
            type = 'F';
        }else if ( STRING(type).contains( 'video' ) ){
            type = 'F';
        }else if ( STRING(type).contains( 'vnd.' ) ){
            type = 'F';
        }else{
            type = 'F';
        }
        console.log( filename + "----" + type );
        callback( { flag: type } );
   });
}

/**
 * App & Server
 */
var app = express()
  , server = http.createServer(app);
app.use(function(req, res, next) {
  var setHeader = res.setHeader;
  res.setHeader = function(name) {
    switch (name) {
      case 'Cache-Control':
      case 'Last-Modified':
      case 'ETag':
        return;
    }
    return setHeader.apply(res, arguments);
  };
  next();
});

//var exec = require("child_process").exec;
//app.post('/load_tree.php', function(req, res){exec("php load_tree.php", function (error, stdout, stderr) {res.send(stdout);});});
app.use(express.bodyParser());
var home = HOME;
app.get('/load_tree', function(req, res){
   var cwd = home;
   if( typeof req.query.id !== 'undefined' && req.query.id){
       cwd = req.query.id;
   }
   console.log(cwd);
   console.log(req.query.id);
   
   if( cwd === home ){
       tree = buildTree(cwd);
       res.write( "[" + JSON.stringify(tree) + "]");
   }else{
       res.write( "[]");
   }
   res.end();
});


var fs = require('fs'),
    path = require('path');
function buildTree(dir) {

        //var flag = isLoadable( type );
        var filename = path.basename( dir ) ;
        var stats = fs.lstatSync(dir),
        info = {
             id: dir,
             text: filename
         //    loadable: flag
        };
        if (stats.isDirectory()) {
           if( home === dir ){
              info.state = "open";
           }else{
              info.state = "closed";
           }
           info.type = "D";
           info.children = fs.readdirSync(dir).map(function(child) {
               return buildTree(dir + '/' + child, callback);
           });
       } else {
           info.type = "F";
           info.state = "open";
       }
       return info;
}

app.get('/load_file', function(req, res){
   var content;
   var filename;
   if( typeof req.query.id !== 'undefined' && req.query.id){
       filename = req.query.id;
   }else{
       res.write( '' );
       res.end();
       return;
   }
   fs.readFile( filename, function (err, data) {
        if( err ){
             data = {
                 status  : 1,
                 message : err
             };
        }
        res.write( STRING(data).escapeHTML().s );
        res.end();
   });
});
app.get('/load_formbox', function(req, res){
   var filename = "formbox.htm";
   fs.readFile( filename, function (err, data) {
        if( err ){
             data = {
                 status  : 1,
                 message : err
             };
        }
        res.write( data );
        res.end();
   });
});
app.post('/upload_file', function(req, res){
   console.log(req.files.file.name);
   console.log(req.files.file.path);
   console.log(req.files.file.type);

   var file = req.body.cwd + "/" + req.files.file.name;
   fs.readFile( req.files.file.path, function (err, data) {
        fs.writeFile(file, data, function (err) {
         if( err ){
                response = {
                    status  : 1,
                    message : err
                };
         }else{
               response = {
                   status  : 0,
                   message : 'File uploaded successfully',
                   filename: req.files.file.name
              };
          }
          console.log( response );
          res.end( JSON.stringify(response) );
        });
   });
});

app.post('/add_file', function(req, res){
   console.log(req.body);
   console.log(req.body.cwd);
   console.log(req.body.file);
   var response = {} ;
   // Create a file in the given directory.
   var filename = req.body.cwd + "/" + req.body.file;
   fs.open( filename,  "w+", function(err, fd) {
      if( err ){
         response = {
             status  : 1,
             message : err
         };
      }else{
         response = {
             status  : 0,
             message : 'File created successfully'
         };
         fs.close(fd);
      }
      console.log( response );
      res.end(JSON.stringify(response));
   });
});

app.post('/delete_file', function(req, res){
   var response = {} ;
   // delete given file in the given directory.
   var filename = req.body.cwd + "/" + req.body.file;
   fs.unlink( filename,  function(err) {
      if( err ){
         response = {
             status  : 1,
             message : err
         };
      }else{
         response = {
             status  : 0,
             message : 'File deleted successfully'
         };
      }
      console.log( response );
      res.end(JSON.stringify(response));
   });
});

app.post('/delete_dir', function(req, res){
   var response = {} ;
   // delete the given directory
   var dirname = req.body.cwd ;
   fs.rmdir( dirname,  function(err) {
      if( err ){
         response = {
             status  : 1,
             message : err
         };
      }else{
         response = {
             status  : 0,
             message : 'Directory deleted successfully'
         };
      }
      console.log( response );
      res.end(JSON.stringify(response));
   });
});

app.post('/add_dir', function(req, res){
   console.log(req.body);
   console.log(req.body.cwd);
   console.log(req.body.dir);
   var response = {} ;
   // Create a file in the given directory.
   var dirname = req.body.cwd + "/" + req.body.dir;
   fs.mkdir( dirname,  function(err) {
      if( err ){
         response = {
             status  : 1,
             message : err
         };
      }else{
         response = {
             status  : 0,
             message : 'Directory created successfully'
         };
      }
      console.log( response );
      res.end(JSON.stringify(response));
   });
});

app.post('/save_file', function(req, res){
   var response = {} ;
   // Create a file in the given directory.
   var filename = req.body.file;
   var content = req.body.content;
   fs.writeFile(filename, content, {flag:'w+'}, function (err) {
      if( err ){
         response = {
             status  : 1,
             message : err
         };
      }else{
         response = {
             status  : 0,
             message : 'File saved successfully'
         };
      }
      console.log( response );
      res.end(JSON.stringify(response));
   });
});

app.post('/rename_file', function(req, res){
   var response = {} ;

   var cwd = req.body.cwd ;
   var oldnode = req.body.oldnode ;
   var newnode = req.body.newnode ;

   fs.rename( cwd + "/" + oldnode, cwd + "/" + newnode, function(err) {
      if( err ){
         response = {
             status  : 1,
             message : err
         };
      }else{
         response = {
             status  : 0,
             message : 'Renamed successfully'
         };
      }
      console.log( response );
      res.end(JSON.stringify(response));
   });
});

/*
app.use(express.basicAuth(function(user, pass, next) {
  if (user !== 'foo' || pass !== 'bar') {
    return next(true);
  }
  return next(null, user);
}));
*/

app.use(express.static(__dirname));
app.use(terminal.middleware());

if (!~process.argv.indexOf('-n')) {
  server.on('connection', function(socket) {
    var address = socket.remoteAddress;
/*
    if (address !== '127.0.0.1' && address !== '::1') {
      try {
        socket.destroy();
      } catch (e) {
        ;
      }
      console.log('Attempted connection from %s. Refused.', address);
    }
*/
      console.log('Got connection from %s.', address);
  });
}

server.listen(8080);

/**
 * Sockets
 */

io = io.listen(server, {
  log: false
});

io.sockets.on('connection', function(sock) {
  socket = sock;

  socket.on('data', function(data) {
    if (stream) stream.write('IN: ' + data + '\n-\n');
    //console.log(JSON.stringify(data));
    term.write(data);
  });

  socket.on('disconnect', function() {
    socket = null;
    console.log('Client got disconnected');
  });

  while (buff.length) {
    socket.emit('data', buff.shift());
  }
});

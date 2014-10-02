#!/usr/bin/env node

var github = require('octonode');
var client = github.client({
  username: 'mcmohd',
  password: 'cohondob1971'
});

client.get('/user', {}, function (err, status, body, headers) {
  console.log(body); //json object
});


// List Repos
//  Check if user has compileonline repos
//  if not then create compileonline repos
//
//Create a parent repo compileonline
/*
client.post('/user/repos', { "name": "compileonline", "description": "Repository to store compileonline projects" }, function (err, status, body, headers) {
  console.log(body); //json object
});
*/


/* Get the content of the repo */
/*
client.get('/repos/mcmohd/compileonline', { }, function (err, status, body, headers) {
  console.log(body); //json object
});
*/
var ghrepo = client.repo('mcmohd/tutorialspoint');
/*
 * List down all the files in the repo
ghrepo.contents('/', function(err, data, headers ){
  console.log(data); //json object
});
*/

/* Push a new file in the repo */
/*
ghrepo.createContents('/compileonline.txt', 'commit message', 'content goes here....', function(err, data, headers ){
  console.log(data); //json object
});
*/

/* Create Project specific path */
/*
ghrepo.createContents('project2/test/mohtashim/testing3/testing4/line.txt', 'commit message', 'content again goes here....', function(err, data, headers ){
  console.log(data); //json object
});
*/

ghrepo.contents('project2/line.txt', function (err, data, headers) {
  if( data ){
      // It means file already exists
      var sha = data.sha;
      /* update the existing file */
      ghrepo.updateContents('project2/line.txt', 'Latest update by the system', 'updated file content', sha, function(err, data, headers ){
           console.log(data); //json object
           console.log("error: " + err);
      });
  }else{
      // This is new file to be created.
      ghrepo.createContents('project2/line.txt', 'New file created by the system', 'New file content', function(err, data, headers ){
           console.log(data); //json object
           console.log("error: " + err);
      });
  }
});


var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');
// var Users = require('../app/collections/users');
// var Links = require('../app/collections/links');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function(){
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  // does mongoose have a 'reset' method on collections?
  Link.find({}, function (links) {
    res.send(200, links.models);
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  // check if link already exists
  Link.findOne({ 
    url: uri 
  }, function (found) {
    if (found) {
      // if link already exists
      // return the link object
      res.send(200, found.attributes);
    } else {
      // if a new link was submitted
      // extract the title using a helper
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.send(404);
        }
        // create new link object
        var link = new Link({
          url: uri,
          title: title,
          base_url: req.headers.origin
        });
        // save the new link
        link.save().then(function (newLink) {
          // Links.add(newLink); // ???
          res.send(200, newLink);
        });
      }); // get title
    } // else
  });

};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ 
    username: username 
  }, function (err, user) {
    if (err || !user) {
      res.redirect('/login');
    };
    user.comparePassword(password, function (err, isMatch) {
      if (err) {
        res.redirect('/login');
      };
      if (isMatch) {
        util.createSession(req, res, user);
      };
      res.redirect('/login');
    });
  });

};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ 
    username: username,
  }, function (err, user) {
    if (err || user) {
      res.redirect('/login');
    };
    if (!user) {
      var newUser = new User({
        username: username,
        password: password
      });

      newUser.save(function (newUser) {
        util.createSession(req, res, newUser);
        // Users.add(newUser); // ???
      });
    }
  });
};

exports.navToLink = function(req, res) {

  Link.findOne({
    code: req.params[0]
  }, function (link) {
    if (!link) {
      res.redirect('/');
    } else {
      res.redirect(link.get('url'));
    }
  });

};
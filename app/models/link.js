var db = require('../config');
var crypto = require('crypto');
var mongoose = require('mongoose');

// var Link = db.Model.extend({
//   tableName: 'urls',
//   hasTimestamps: true,
//   defaults: {
//     visits: 0
//   },
//   initialize: function(){
//     this.on('creating', function(model, attrs, options){
//       var shasum = crypto.createHash('sha1');
//       shasum.update(model.get('url'));
//       model.set('code', shasum.digest('hex').slice(0, 5));
//     });
//   }
// });

var linkSchema = new mongoose.Schema({
  title: { type: String },
  url: { type: String },
  base_url: { type: String },
  code: { type: String, unique: true }
});

linkSchema.pre('save', function(next) {
  // if (!link.isNew()) return next();
  var shasum = crypto.createHash('sha1');
  shasum.update(this.url);
  this.set('code', shasum.digest('hex').slice(0, 5));
  next();
});

var Link = mongoose.model('Link', linkSchema);

// module.exports = Link;

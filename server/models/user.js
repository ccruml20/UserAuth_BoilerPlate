
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

// Define Model
const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String
});

// On save Hook, encrypt password
// Before saving, run function
userSchema.pre('save', function(next){
  const user = this;
  // generate a salt then run callback
  bcrypt.genSalt(10, function(err, salt){
    if (err) { return next(err); }
    // hash password using salt then run callback
    bcrypt.hash(user.password, salt, null, function(err, hash){
      if (err) { return next(err); }
      // overwrite password with encrypted password
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
    if (err) {
      return callback(err);
    }
    callback(null, isMatch);
  });
}
// Create Model Class
const ModelClass = mongoose.model('user', userSchema);

// Export Model
module.exports = ModelClass;

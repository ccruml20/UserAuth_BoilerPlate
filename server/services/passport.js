const passport = require('passport');
const User = require('../models/user');
const config = require('../config')
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, function(email, password, done){
  // Verify email and password, call done(user); if exists
  // Otherwise call done(); without an argument
  User.findOne({ email: email }, function(err, user) {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false);
    }
    // compare password with bcrypt  })
    user.comparePassword(password, function(err, isMatch) {
      if (err) {
        return done(err);
      }
      if (!isMatch) {
        return done(null, false);
      }
      return done(null, user);
    });
  });
});

// Setup option for Jwt
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

// Create JWt Strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  // See if the user Id in the payload exists in the database,
  //if true: call done(user);  with user argument
  //otherwise: call done(); with no arguments
  User.findById(payload.sub, function(err, user) {
    if (err) {
      return done(err, false);
    }
    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

// Tell passport to use Strategy
passport.use(localLogin);
passport.use(jwtLogin);

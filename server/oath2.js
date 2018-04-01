var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(new GoogleStrategy({
    clientID: config.get('110819454928-cjh1mvmb4k4bi76l4ngjhbalpqfcpo17.apps.googleusercontent.com'),
	  clientSecret: config.get('cd2CfXZQ7Dm5z8tihnkhV3sM'),
	  callbackURL: config.get('http://localhost:3030/auth/google/callback'),
	  accessType: 'offline'
  },
  function(accessToken, refreshToken, profile, done) {
       User.findOrCreate({ googleId: profile.id }, function (err, user) {
         return done(err, user);
       });
  }
));
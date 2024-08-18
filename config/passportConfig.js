const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const User = require('../model/usreModel')

passport.use(new GoogleStrategy({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET_KEY,
    callbackURL: '/auth/google/callback'
},
    async(accessToken, refreshToken, profile, done) => {
        const existingUser = await User.findOne({googleId: profile.id});
        if(existingUser){
            return done(null, existingUser)
        }

        const newUser = new user({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value
        })
        await newUser.save();
        done(null, newUser)
    }
))

passport.serializeUser((user, done)=>{
    done(null, user.id)
})

passport.deserializeUser(async(id, done)=>{
    const user = await User.findById(id)
    done(null, user)
})
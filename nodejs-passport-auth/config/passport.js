import mongoose      from 'mongoose';
import bcrypt        from 'bcryptjs';
import UserModel     from '../models/User';
import PassportLocal from 'passport-local';

const LocalStrategy = PassportLocal.Strategy;

export default function (passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            // Match user
            UserModel.findOne({ email: email })
                .then(user => {
                    if (!user) {
                        return done(null, false, { message: 'Your email is not registered' });
                    }

                    // Match password
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) throw err;

                        if (isMatch) {
                            return done(null, user);
                        }

                        return done(null, false, { message: 'Password incorrect' })
                    });
                })
                .catch(err => console.log(err));
        })
    );

    /**
     * Allows Passport to maintain session state
     */
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        UserModel.findById(id, (err, user) => {
            done(err, user);
        });
    });
}
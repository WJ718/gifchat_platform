const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');

const User = require('../models/user');

module.exports = () => {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
    }, async (email, password, done) => {
        try {   
            const exUser = await User.findOne({where: {email}});

            if(!exUser) {
                done(null, false, {message: '가입되지 않은 회원입니다.'});
            }

            const result = await bcrypt.compare(password, exUser.password);
            if(result) {
                done(null, exUser);
            } else {
                done(null, false, {message: '비밀번호가 일치하지 않습니다.'});
            }    
        } catch(err) {
            console.error(err);
            done(err);
        }
    }));
};
const User = require('../models/user');
const passport = require('passport');
const bcrypt = require('bcrypt');

exports.join = async (req,res,next) => {
    const {nick, email, password} = req.body;
    try {
        const exUser = await User.findOne({where: {email}});

        if(exUser) {
            const errorMessage = `이미 존재하는 사용자: ${email}`;
            console.log(errorMessage);
            return res.redirect(`/?error=${errorMessage}`);
        } 

        const hash = await bcrypt.hash(password, 12);

        const newUser = await User.create({
            email,
            nick,
            password : hash
        });

        console.log(`${nick} 사용자 DB 생성 완료`)

        return req.login(newUser, (loginErr) => {
            if (loginErr) {
                console.error(loginErr);
                return next(loginErr);
            }
            return res.redirect('/');
        });
    } catch(err) {
        console.error(err);
        next(err);
    }
}


exports.login = async (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if(authError) {
            console.error(authError);
            next(authError);
        }

        if(!user) {
            return res.redirect(`/?error=${info.message}`);
        }

        return req.login(user, (loginError) => {
            if(loginError) {
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        });
    }) (req,res,next);
};
  
exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            next(err);
        }
        res.redirect('/')
    });
};

exports.changeNick = async(req,res,next) => {
    try {
        const {nick} = req.body;
        await User.update(
            { nick }, 
            { where: { id: req.user.id } }
        );
        res.redirect('/');
    } catch(err) {
        console.error(err);
        next(err);
    }
}
const {Room, User} = require('../models');

exports.renderMain = async (req, res, next) => {
    try {
        const rooms = await Room.findAll();
        return res.render('main', {
            title: 'Gif chat에 오신 것을 환영합니다!',
            error: req.query.error,
            rooms,
        });
    } catch(err) {
        console.error(err);
        next(err);
    }
}

exports.renderProfile = async (req,res,next) => {
    try {
        const myRooms = await Room.findAll({
            where: {ownerId: req.user.id},
        });

        res.render('profile', {
            myRooms,
        });
    } catch(err) {
        console.error(err);
        next(err);
    }
}


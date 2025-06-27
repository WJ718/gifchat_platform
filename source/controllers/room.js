const { where, Model, TINYINT } = require('sequelize');
const {Room, Chat, User} = require('../models');

exports.createRoom = async (req,res,next) => {
    const {roomName} = req.body;
    try {
        const room = await Room.findOne({where: {roomName}});
        if(room) {
            const errorMessage = `${roomName}은 이미 존재하는 방입니다.`;
            console.log(errorMessage);
            return res.redirect(`/?error=${errorMessage}`);
        }

        await Room.create({
            roomName,
            ownerId: req.user.id,
        });

        res.redirect('/');
    } catch(err) {
        console.error(err);
        next(err);
    }
};

exports.enterRoom = async (req,res,next) => {
    try {
        const room = await Room.findOne({where: {id: req.params.id}});
        const roomId = req.params.id;

        if(!room) {
            const errorMessage = `이미 존재하지 않는 방입니다.`;
            console.log(errorMessage);
            return res.redirect(`/?error=${errorMessage}`);
        }

        const chats = await Chat.findAll({
            where : {RoomId: roomId},
            include : {model: User},
            order: [['createdAt', 'ASC']],
        });

        res.render('chat', {
            room,
            chats,
            user: req.user,
            title: room.roomName,
        });
    } catch(err) {
        console.error(err);
        next(err);
    }
}

exports.removeRoom = async (req,res,next) => {
    const roomId = req.params.id;
    try {            
        if(!roomId) {
            const errorMessage = `이미 존재하지 않는 방입니다.`;
            console.log(errorMessage);
            return res.redirect(`/?error=${errorMessage}`);
        }

        await Room.destroy({
            where: {id: roomId},
        });
        res.redirect('/');
    } catch(err) {
        console.error(err)
        next(err)
    }
};

exports.sendFile = (req,res,next) => {
    try {
        if(!req.file) {
            return res.status(400).json({error: '파일이 없습니다.'});
        }
        // 저장된 파일 명
        const fileName = req.file.filename;

        // 클라이언트에서 접근 가능한 url
        const url = `/gif/${fileName}`;

        res.json({url}); // 클라이언트에 url 전달
    } catch(err) {
        console.error(err);
        next(err);
    }
}
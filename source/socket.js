const SocketIO = require('socket.io');
const {Room, Chat, User} = require('./models');

module.exports = (server, app, sessionMiddleware) => {
    const io = SocketIO(server, {path: '/socket.io'});
    io.on('connection', (socket) => {
        console.log('새로운 클라이언트 접속');
        
        // 방 입장
        socket.on('join', (roomId, user) => {
            socket.join(roomId);
            console.log(`${user.nick}님이 ${roomId}번 방에 입장하셨습니다.`);
        });

        // emit된 메시지 수신 
        socket.on('chat', async (data) => {
            const {roomId, message, gif, user} = data;

            // DB 저장
            await Chat.create({
                message: message || null, 
                gif,
                RoomId: roomId,
                UserId: user.id,
              });

            // 방 사용자에게 메시지 전송
            io.to(roomId).emit('chat' , {
                user: user.nick,
                message,
                gif,
            });
        });

        socket.on('disconnect', () => {
            console.log('클라이언트 접속 해제');
        });
    });
}
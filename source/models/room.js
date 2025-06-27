const Sequelize = require('sequelize');

class Room extends Sequelize.Model {
    static initiate(sequelize) {
        Room.init({
            roomName: {
                type: Sequelize.STRING(20),
                allowNull: false,
                unique: true,
            },
        }, {
            sequelize,
            timestamps: true,
            modelName: 'Room',
            tableName: 'rooms',
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        })
    }

    static associate(db) {
        // 관계 >> Room(1) : Chat(N)
        db.Room.hasMany(db.Chat);
        db.Room.belongsTo(db.User, { as: 'owner', foreignKey: 'ownerId' });
    }
};

module.exports = Room;

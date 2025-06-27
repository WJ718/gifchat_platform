const Sequelize = require('sequelize');

class Chat extends Sequelize.Model {
    static initiate(sequelize) {
        Chat.init({
            message: {
                type: Sequelize.STRING(200),
                allowNull: true,
            },
            gif: {
                type: Sequelize.STRING(200), 
                allowNull: true,
            },            
        }, {
            sequelize,
            timestamps: true,
            modelName: 'Chat',
            tableName: 'chats',
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        })
    }

    static associate(db) {
        db.Chat.belongsTo(db.User);
        db.Chat.belongsTo(db.Room);
    }
};

module.exports = Chat;
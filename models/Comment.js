const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
// Create our Comment model
class Comment extends Model {}
// Define table columns and configuration
Comment.init(
    {
        // Define an id column
        id: {
            // Use the special Sequelize DataTypes object provide what type of data it is
            type: DataTypes.INTEGER,
            // This is the equivalent of SQL's `NOT NULL` option
            allowNull: false,
            // Instruct that this is the Primary Key
            primaryKey: true,
            // Turn on auto increment
            autoIncrement: true,
        },
        // Define a comment_text column
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        // Define a user_id column
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                // This references the `user` model, which we set in `User.js` as its `modelName` property
                model: 'user',
                key: 'id',
            },
        },
        // Define a post_id column
        post_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                // This references the `post` model, which we set in `Post.js` as its `modelName` property
                model: 'post',
                key: 'id',
            },
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            
    },
    },
    {
        // TABLE CONFIGURATION OPTIONS GO HERE 
        sequelize,
        timestamps: true,
        freezeTableName: true,
        underscored: true,
        modelName: 'Comment',
    }
);
module.exports = Comment;
const {Sequelize, Model, DataTypes} = require('sequelize');
const sequelize = require('../config/connection');
// Create our User model
class User extends Model {
    // set up an enviorment to validate users password
    validPassword(password) {
        return bcrypt.compareSync(password, this.password);
}
}
// Define table columns and configuration
User.init(
    {
        // Define an id column
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
    },
        // Define a username column
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
    },
        // Define a password column`
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [8],
        },
    },
},

    {
        hooks: {
            // set up beforeCreate lifecycle "hook" functionality
            async beforeCreate(newUserData) {
                newUserData.password = await bcrypt.hash(newUserData.password, 10);
                return newUserData;
        },
    },
        // TABLE CONFIGURATION OPTIONS GO HERE
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'User',
    }
);
module.exports = User;
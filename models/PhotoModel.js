import { DataTypes } from "sequelize";
import db from "../database/database.js";
import Users from "./UserModel.js";

const Photos = db.define('photos', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    caption: {
        type: DataTypes.STRING,
        allowNull: true
    },
    photoUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
}, {
    freezeTableName: true
});

Users.hasMany(Photos);
Photos.belongsTo(Users, {
    foreignKey: 'userId',
    onDelete: 'CASCADE'
});

export default Photos;
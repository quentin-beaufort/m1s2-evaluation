const {DataTypes} = require('sequelize');

const sequelize = require('../db.config');

const Membre = sequelize.define('Membre',{
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey : true,
        autoIncrement: true
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName : {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    }
},{
    tableName: 'membres',
    timestamps:  false,
})

module.exports = Membre


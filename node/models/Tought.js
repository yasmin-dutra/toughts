const { DataTypes } = require('sequelize')

const db = require('../db/conn')

const User = require('./User')

// User

const Tought = db.define('Tought', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        require: true,
        /**teste */
        UserId: {
            type: DataTypes.INTERGER, foreignKey: true
        }
    },
})

Tought.belongsTo(User, { foreignKey: 'UserId'})
User.hasMany(Tought, { foreignKey: 'UserId'})

module.exports = Tought
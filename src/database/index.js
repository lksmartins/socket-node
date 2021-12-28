const Sequelize = require('sequelize')
const config = require('../config/database')

const Group = require('../models/Group')
const Room = require('../models/Room')

//console.log(config)

const connection = new Sequelize(config[process.env.ENV])

try {
    connection.authenticate();
    console.log('Connection to the database has been established successfully.');

    Group.init(connection)
    Room.init(connection)

    Group.associate(connection.models)
    Room.associate(connection.models)

} catch (error) {
    console.error('Unable to connect to the database:', error);
}

module.exports = connection
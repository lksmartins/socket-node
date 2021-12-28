const { Model, DataTypes } = require('sequelize')

class Group extends Model {

  static init(sequelize) {
    super.init({
      title: DataTypes.STRING,
      gm: DataTypes.STRING,
      players: DataTypes.INTEGER,
      room_size: DataTypes.INTEGER,
      time_to_start: DataTypes.DATE,
      time_to_end: DataTypes.DATE
    },{
      sequelize,
      tableName: 'groups',
      timestamps: false
    })
  }

  static associate( models ){
    this.hasMany(models.Room, { foreignKey: 'group_id', as: 'rooms' })
  }

}

module.exports = Group
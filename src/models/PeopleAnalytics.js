const { Model, DataTypes } = require('sequelize')

class PeopleAnalytics extends Model {

  static init(sequelize) {
    super.init({
      action_type: DataTypes.STRING,
      ref_id: DataTypes.STRING,
      action: DataTypes.STRING,
      player_id: DataTypes.STRING,
      room_id: DataTypes.STRING
    },{
      sequelize,
      tableName: 'people_analytics',
      timestamps: false
    })
  }

  static associate( models ){
    this.belongsTo( models.Room, { foreignKey: 'room_id', as: 'room' } )
  }

}

module.exports = PeopleAnalytics
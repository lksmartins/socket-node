const { Model, DataTypes } = require('sequelize')

class Room extends Model {

  static init(sequelize) {
    super.init({
      hash: DataTypes.STRING,
      title: DataTypes.STRING,
      name: DataTypes.STRING,
      group_id: DataTypes.INTEGER,
      players: DataTypes.INTEGER,
      time_ended: DataTypes.DATE,
      codes: DataTypes.STRING
    },{
      sequelize,
      tableName: 'sessions',
      timestamps: false
    })
  }

  static associate( models ){
    this.belongsTo( models.Group, { foreignKey: 'group_id', as: 'group' } )
  }

}

module.exports = Room
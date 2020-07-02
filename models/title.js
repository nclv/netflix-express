'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Title extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Title.init({
    name: DataTypes.STRING,
    type: {
      type: DataTypes.BOOLEAN,
      get() {
        return this.getDataValue('type') ? "Seen" : "Rated"
      },
      set(valueToBeSet) {
        this.setDataValue('type', (valueToBeSet === "Seen"))
      },
    },
    date: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Title',
  });
  return Title;
};
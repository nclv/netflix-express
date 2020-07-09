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
        let type = this.getDataValue('type');
        let retVal;
        if (type === undefined) {
          retVal = undefined;
        } else if (type === true) {
          retVal = "Seen";
        } else {
          retVal = "Rated";
        }
        return retVal;
      },
      set(valueToBeSet) {
        let type;
        if (valueToBeSet === "Seen") {
          type = true;
        } else if (valueToBeSet === "Rated") {
          type = false;
        } else {
          type = undefined;
        }
        this.setDataValue('type', type);
      },
    },
    date: DataTypes.STRING,
    url: {
      type: DataTypes.VIRTUAL,
      get() {
        return '/catalog/title/' + this.id;
      },
      set(value) {
        throw new Error('Do not try to set the `url` value!');
      }
    }
  }, {
    sequelize,
    modelName: 'Title',
  });
  return Title;
};
import Sequelize, { Model } from "sequelize";

class Equipment extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        type: Sequelize.STRING,
        lastMaintananceDate: Sequelize.DATE,
        frequencyOfMaintenanceDays: Sequelize.INTEGER,
        // TODO: possibly soft delete boolean
      },
      {
        sequelize,
        timestamps: true,
        tableName: 'Equipments'
      }
    );

    return this;
  }

}

export default Equipment;

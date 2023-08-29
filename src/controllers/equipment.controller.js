import * as Yup from "yup";
import Equipment from "../models/Equipment";
import {
  BadRequestError,
  UnauthorizedError,
  ValidationError,
} from "../utils/ApiError";
const { Op } = require("sequelize");


const equipmentSchema = Yup.object().shape({
  name: Yup.string().required(),
  type: Yup.string().required(),
  lastMaintananceDate: Yup.date(),
  frequencyOfMaintenanceDays: Yup.number().default(14),
});

let equipmentController = {
  add: async (req, res, next) => {
    try {

      if (!(await equipmentSchema.isValid(req.body))) throw new ValidationError();

      const { name, type, lastMaintananceDate, frequencyOfMaintenanceDays } = req.body; // unused vars for swagger-autogen

      const equipmentExists = await Equipment.findOne({
        where: { name },
      });

      if (equipmentExists) throw new BadRequestError();

      const equipment = await Equipment.create(req.body);

      return res.status(200).json(equipment);
    } catch (error) {
      next(error);
    }
  },

  query: async (req, res, next) => {
    try {
      
      const equipments = await Equipment.findAll({
        where: {...{active: true}, ...req.query}
      });
      return res.status(200).json(equipments);
    } catch (error) {
      next(error);
    }
  },

  get: async (req, res, next) => {
    try {
      const { id } = req.params;
      const equipment = await Equipment.findByPk(id);

      if (!equipment || !equipment?.active) throw new BadRequestError();

      return res.status(200).json(equipment);
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const equipment = await Equipment.findByPk(id);

      if (!equipment || !equipment?.active) throw new BadRequestError();

      // if (!(await equipmentSchema.isValid(req.body))) throw new ValidationError();

      const { name, type, lastMaintananceDate, frequencyOfMaintenanceDays } = req.body; // unused vars for swagger-autogen

      if (name) {
        const equipmentExists = await Equipment.findOne({
          where: { name },
        });

        if (equipmentExists) throw new BadRequestError();
      }

      const newEquipment = await equipment.update(req.body);

      return res.status(200).json(newEquipment);
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      const equipment = await Equipment.findByPk(id);
      if (!equipment || !equipment?.active) throw new BadRequestError();

      // equipment.destroy();
      // or this https://sequelize.org/docs/v6/core-concepts/paranoid/
      equipment.update({active: false});

      return res.status(200).json({ msg: "Deleted" });
    } catch (error) {
      next(error);
    }
  },

  dueForMaintenance: async (req, res, next) => {
    try {
      let d = new Date();
      d.setDate(d.getDate() - (req.query.daysUntilDue? parseInt(req.query.daysUntilDue) : 14) )
      const equipments = await Equipment.findAll({
        where: {
          active: true,
          lastMaintananceDate: {
            [Op.lte]: d
          }
        }
      });
      return res.status(200).json(equipments);
    } catch (error) {
      next(error);
    }
  },
};

export default equipmentController;

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

      const { name } = req.body;

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
      
      const equipments = await Equipment.findAll();
      console.log(req)
      return res.status(200).json(equipments);
    } catch (error) {
      next(error);
    }
  },

  get: async (req, res, next) => {
    try {
      const { id } = req.params;
      const equipment = await Equipment.findByPk(id);

      if (!equipment) throw new BadRequestError();

      return res.status(200).json(equipment);
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const equipment = await Equipment.findByPk(id);

      if (!equipment) throw new BadRequestError();

      if (!(await equipmentSchema.isValid(req.body))) throw new ValidationError();

      const { name } = req.body;

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
      if (!equipment) throw new BadRequestError();

      equipment.destroy(); // TODO: possible soft delete boolean

      return res.status(200).json({ msg: "Deleted" });
    } catch (error) {
      next(error);
    }
  },

  dueForMaintenance: async (req, res, next) => {
    try {
      
      const equipments = await Equipment.findAll({
        where: {
          // lastMaintananceDate: {
          //   [Op.lte]: new Date.now() //TODO
          // }
        }
      });
      return res.status(200).json(equipments);
    } catch (error) {
      next(error);
    }
  },
};

export default equipmentController;

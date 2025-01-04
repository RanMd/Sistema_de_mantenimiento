import { Request, Response } from 'express';
import Mantenimiento from '../models/Mantenimiento';
import { Op } from 'sequelize';

export const getAllMantenimientos = async (req: Request, res: Response) => {
    try {
        const mantenimientos = await Mantenimiento.findAll();
        res.status(200).json(mantenimientos);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching mantenimientos', error });
    }
};

export const getMantenimientosByFilter = async (req: Request, res: Response) => {
    const { state, startDate, endDate } = req.query;

    try {
        const where: any = {};

        if (state) {
            where.state_mant = state;
        }

        if (startDate || endDate) {
            where.start_mant = {};
            if (startDate) {
                where.start_mant[Op.gte] = new Date(startDate as string);
            }
            if (endDate) {
                where.start_mant[Op.lte] = new Date(endDate as string);
            }
        }

        const mantenimientos = await Mantenimiento.findAll({ where });
        res.status(200).json(mantenimientos);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching mantenimientos by filters', error });
    }
};

export const getTotalMantenimientos = async (_req: Request, res: Response) => {
    try {
        const total = await Mantenimiento.count();
        res.status(200).json({ total });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching total mantenimientos', error });
    }
};

export const getTotalMantenimientosByState = async (_req: Request, res: Response) => {
    try {
        const totals = await Mantenimiento.findAll({
            attributes: ['state_mant', [Mantenimiento.sequelize!.fn('COUNT', Mantenimiento.sequelize!.col('state_mant')), 'count']],
            group: ['state_mant'],
        });

        res.status(200).json(totals);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching total mantenimientos by state', error });
    }
};

export const getTotalMantenimientosByUser = async (_req: Request, res: Response) => {
    try {
        const totals = await Mantenimiento.findAll({
            attributes: ['user_mant', [Mantenimiento.sequelize!.fn('COUNT', Mantenimiento.sequelize!.col('user_mant')), 'count']],
            group: ['user_mant'],
        });

        res.status(200).json(totals);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching total mantenimientos by user', error });
    }
};

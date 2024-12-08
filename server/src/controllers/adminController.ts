import { Admin } from '../models/adminModel';
import { Response } from 'express';

export const getAdmins = async (res: Response) => {
    try {
        const admins = await Admin.findAll();
        res.json(admins)
    } catch (error) {
        res.status(500).json({message: (error as Error).message})
    }
}
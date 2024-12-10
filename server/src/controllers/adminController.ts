import { User } from '../models/adminModel';
import { Request, Response } from 'express';

export const getAdmins = async (req: Request, res: Response) => {
    try {
        const users = await User.findAll();
        res.json(users)
    } catch (error) {
        res.status(500)
        res.json({message: (error as Error).message})
    }
}
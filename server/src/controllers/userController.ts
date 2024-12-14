import { User } from '../models/adminModel';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const SECRET = 'clave_secreta';

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.findAll();
        res.json(users)
    } catch (error) {
        res.status(404)
        res.json({ message: (error as Error).message })
    }
}

export const getUser = async (req: Request, res: Response) => {
    try {
        const { userName } = req.body;
        const whereClause: { NOM_USU?: string } = {};
        whereClause.NOM_USU = userName;

        const user = await User.findOne({ where: whereClause });

        if (!user) {
            res.json({ exist: false, message: req.body.userName })
            return;
        }

        res.json({ exist: true, message: null })
    } catch (error) {
        res.status(404)
        res.json({ exist: false, message: (error as Error).message })
    }
}

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { userName, password } = req.body;

        const whereClause: { 
            NOM_USU?: string,
            CON_USU?: string  
        } = {};
        whereClause.NOM_USU = userName;
        whereClause.CON_USU = password;

        const user = await User.findOne({ where: whereClause });

        const token = jwt.sign({ 
            id : user?.ID_USU,
            rol: user?.ROL_USU
         }, SECRET);

        if (!user) {
            res.json({ exist: false, message: req.body })
            return;
        }
        
        res.json({ id: user.ID_USU, rol: user.ROL_USU, token: token })
    } catch (error) {
        res.status(404)
        res.json({ exist: false, message: req.body + error })
    }
}
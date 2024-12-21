import { User } from '../models/userModel';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const SECRET = 'clave_secreta';

export const getUser = async (req: Request, res: Response) => {
    try {
        const { userName } = req.body;

        const whereClause: { name_user?: string } = {};
        whereClause.name_user = userName;

        const user = await User.findOne({ where: whereClause });

        if (!user) throw new Error('Usuario no encontrado');

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
            name_user?: string,
            pass_user?: string
        } = {};
        whereClause.name_user = userName;
        whereClause.pass_user = password;

        const user = await User.findOne({ where: whereClause });

        const token = jwt.sign({
            id: user?.id_user,
            rol: user?.rol_user
        }, SECRET);

        if (!user) throw new Error('Contraseña incorrecta');

        res.json({ id: user.id_user, rol: user.rol_user, token: token })
    } catch (error) {
        res.status(404)
        res.json({ exist: false, message: (error as Error).message })
    }
}
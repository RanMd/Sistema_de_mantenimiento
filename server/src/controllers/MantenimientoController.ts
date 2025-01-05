import { Request, Response } from 'express';
import Mantenimiento from '../models/Mantenimiento';

const createMantenimiento = async (req: Request, res: Response): Promise<void> => {
    try {
        const { cod_mant, user_mant, start_mant, end_mant, state_mant, description } = req.body;

        // Validación básica de los campos obligatorios
        if (!cod_mant || !user_mant || !start_mant || !state_mant || !description) {
            res.status(400).json({ message: 'Todos los campos obligatorios deben ser proporcionados.' });
            return;
        }

        // Creación del nuevo registro
        const nuevoMantenimiento = await Mantenimiento.create({
            cod_mant,
            user_mant,
            start_mant,
            end_mant, // Puede ser undefined
            state_mant,
            description,
        });

        res.status(201).json({ message: 'Mantenimiento creado con éxito.', data: nuevoMantenimiento });
    } catch (error) {
        res.status(500).json({ message: `Error al crear el mantenimiento: ${(error as Error).message}` });
    }
};

const getMantenimientos = async (req: Request, res: Response): Promise<void> => {
    try {
        // Consultar todos los mantenimientos en la base de datos
        const mantenimientos = await Mantenimiento.findAll(); // Asumiendo que usas Sequelize o similar

        // Verificar si se encontraron mantenimientos
        if (mantenimientos.length === 0) {
            res.status(404).json({ message: 'No se encontraron mantenimientos.' });
            return;
        }

        // Responder con los datos obtenidos
        res.status(200).json({ data: mantenimientos });
    } catch (error) {
        res.status(500).json({ message: `Error al obtener los mantenimientos: ${(error as Error).message}` });
    }
};

export { createMantenimiento, getMantenimientos };

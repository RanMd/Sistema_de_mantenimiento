import { Request, Response } from 'express';
import RegistroActivos from '../models/RegistroActivos';

// Obtener todos los registros de activos
// Obtener todos los registros de activos
export const getRegistroActivos = async (req: Request, res: Response) => {
    try {
        const registros = await RegistroActivos.findAll({
            attributes: [
                'id_reg',
                'id_act',
                'nom_act',
                'mar_act',
                'mod_act',
                'serie_act',
                'pro_per',
                'ubi_act_per',
                'estado',
                'fecha_compra',
                'registrado_por',
                'responsable',
                'tipo_activo', // Nuevo campo
            ],
        });
        res.json(registros);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los registros de activos', error });
    }
};

// Crear un nuevo registro de activo
export const createRegistroActivo = async (req: Request, res: Response) => {
    try {
        const registros = Array.isArray(req.body) ? req.body : [req.body];
        const createdRegistros = await RegistroActivos.bulkCreate(registros);
        res.status(201).json(createdRegistros);
    } catch (error: Error | unknown) {
        res.status(500).json({ message: 'Registro creado' + req.body + error });
    }
};

// Actualizar un registro de activo
export const updateRegistroActivo = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const registro = await RegistroActivos.findByPk(id);
        if (!registro) {
            return res.status(404).json({ message: 'Registro no encontrado' });
        }
        await registro.update(req.body);
        res.json(registro);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el registro de activo', error });
    }
};

// Eliminar un registro de activo
export const deleteRegistroActivo = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const registro = await RegistroActivos.findByPk(id);
        if (!registro) {
            return res.status(404).json({ message: 'Registro no encontrado' });
        }
        await registro.destroy();
        res.json({ message: 'Registro eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el registro de activo', error });
    }
};

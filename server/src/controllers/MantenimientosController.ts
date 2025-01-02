import { Request, Response } from 'express';

const getLastIdMaintenance = (req: Request, res: Response) => {
    res.json({ data: 1 });
}

// ! Tienes que hacer algo como esto para que funcione

// const getLastId = async (req: Request, res: Response) => {
//     try {
//         const lastId = await Activo.max<number, Activo>('id_act', {
//             raw: true
//         });

//         if (!lastId) {
//             res.status(200).json({ data: 0 });
//             return;
//         }

//         res.status(200).json({ data: lastId });
//     } catch (error) {
//         res.status(500).json({ message: (error as Error).message });
//     }
// };

export { getLastIdMaintenance };
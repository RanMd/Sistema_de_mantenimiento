import { Request, Response } from 'express';
import { Activo, TypeActive, MarcaActivo, ProcesoCompra, ComponenteActivo } from '../models/Activos';
import { col, fn } from 'sequelize';

const saveActive = async (req: Request, res: Response) => {
    try {
        const { name_act, code_act, ubication_act, brand_act, type_act, buy_process_act } = req.body;

        if (!name_act || !code_act || !ubication_act || !brand_act || !type_act || !buy_process_act) {
            throw new Error('Faltan campos por llenar');
        }

        const activo = await Activo.create({
            name_act,
            code_act,
            ubication_act,
            brand_act,
            type_act,
            buy_process_act
        });

        res.status(201).json(activo);
    } catch (error) {
        console.log((error as Error).message)
        res.status(500).json({ message: (error as Error).message });
    }
};

const saveProcess = async (req: Request, res: Response) => {
    try {
        const { code_proc, provider_proc } = req.body;

        if (!code_proc || !provider_proc) {
            throw new Error('Faltan campos por llenar');
        }

        const activo = await ProcesoCompra.create({
            code_proc,
            provider_proc
        });

        res.status(201).json(activo);
    } catch (error) {
        console.log((error as Error).message)
        res.status(500).json({ message: (error as Error).message });
    }
};

const deleteActive = async (req: Request, res: Response) => {
    try {
        const { id_active } = req.body;

        const activo = await Activo.findByPk(id_active);

        if (!activo) { throw new Error('Activo no encontrado') }

        await activo.destroy();
    } catch (error) {
        console.log((error as Error).message)
        res.status(500).json({ message: (error as Error).message });
    }
}

const deleteProcess = async (req: Request, res: Response) => {
    try {
        const { id_proc } = req.body;

        const process = await ProcesoCompra.findByPk(id_proc);

        if (!process) { throw new Error('Proceso no encontrado') }

        await process.destroy();
    } catch (error) {
        console.log((error as Error).message)
        res.status(500).json({ message: (error as Error).message });
    }
}

const getAllActives = async (req: Request, res: Response) => {
    try {
        const activos = await Activo.findAll({
            attributes: {
                exclude: ['ubication_act', 'state_act', 'buy_process_act'],
            },
            include: [
                {
                    association: 'ubication',
                    attributes: ['name_ubi']
                },
                {
                    association: 'category',
                    attributes: ['category_type'],
                },
                {
                    association: 'buy_process',
                    attributes: ['code_proc'],
                }
            ],
            raw: true,
            nest: true
        });

        if (activos.length === 0) {
            throw new Error('No existen activos');
        }

        res.status(200).json({ data: activos });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

const getAllActivesPerUbication = async (req: Request, res: Response) => {
    try {
        const { id_ubication } = req.body

        const activos = await Activo.findAll({
            where: {
                ubication_act: id_ubication
            },
            attributes: {
                exclude: ['ubication_act', 'state_act', 'buy_process_act'],
            },
            include: [
                {
                    association: 'ubication',
                    attributes: ['name_ubi']
                },
                {
                    association: 'category',
                    attributes: ['category_type'],
                },
                {
                    association: 'buy_process',
                    attributes: ['code_proc'],
                }
            ],
            raw: true,
            nest: true
        });

        if (activos.length === 0) {
            throw new Error('No existen activos en esa ubicación');
        }

        res.status(200).json({ data: activos });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

const getActive = async (req: Request, res: Response) => {
    try {
        const { id_activo } = req.body;

        const activo = await Activo.findByPk(id_activo, {
            attributes: {
                exclude: ['ubication_act', 'buy_process_act']
            },
            include: [
                {
                    association: 'ubication',
                    attributes: ['name_ubi', 'floor_ubi'],
                    include: [
                        {
                            association: 'edificio',
                            attributes: ['name_edi'],
                        }
                    ],
                },
                {
                    association: 'category',
                    attributes: ['category_type'],
                },
                {
                    association: 'buy_process',
                    attributes: ['code_proc', 'date_proc'],
                }
            ],
            raw: true,
            nest: true
        });

        if (!activo) {
            throw new Error('Activo no encontrado');
        }

        res.status(200).json({ data: activo });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

const getLastIdActive = async (req: Request, res: Response) => {
    try {
        const lastId = await Activo.max<number, Activo>('id_act', {
            raw: true
        });

        if (!lastId) {
            res.status(200).json({ data: 0 });
            return;
        }

        res.status(200).json({ data: lastId });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

const getLastIdProcess = async (req: Request, res: Response) => {
    try {
        const lastId = await ProcesoCompra.max<number, ProcesoCompra>('id_proc', {
            raw: true
        });

        if (!lastId) {
            res.status(200).json({ data: 0 });
            return;
        }

        res.status(200).json({ data: lastId });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

const getCategories = async (req: Request, res: Response) => {
    try {
        const data = await TypeActive.findAll({
            attributes: [[fn('DISTINCT', col('category_type')), 'category']],
            raw: true
        })

        if (data.length === 0) {
            throw new Error('No existen categorias');
        }

        res.status(200).json({ data: data })
    } catch (error) {
        res.status(500).json({ message: (error as Error).message })
    }
}

const getTypes = async (req: Request, res: Response) => {
    try {
        const data = await TypeActive.findAll({
            attributes: ['name_type'],
        })

        if (data.length === 0) {
            throw new Error('No existen tipos de activos');
        }

        res.status(200).json({ data: data })
    } catch (error) {
        res.status(500).json({ message: (error as Error).message })
    }
}

const getTypesPerCategory = async (req: Request, res: Response) => {
    try {
        const { category } = req.body

        const data = await TypeActive.findAll({
            attributes: ['name_type'],
            raw: true,
            where: {
                category_type: category
            }
        })

        if (data.length === 0) {
            throw new Error('No existen tipos de activos para esa categoria');
        }

        res.status(200).json({ data: data })
    } catch (error) {
        res.status(500).json({ message: (error as Error).message })
    }
}

const getBrandsPerCategory = async (req: Request, res: Response) => {
    try {
        const { category } = req.body

        const data = await MarcaActivo.findAll({
            attributes: ['name_fab'],
            raw: true,
            where: {
                category_fab: category
            }
        })

        if (data.length === 0) {
            throw new Error('No existen marcas para esa categoria');
        }

        res.status(200).json({ data: data })
    } catch (error) {
        res.status(500).json({ message: (error as Error).message })
    }
}

const getProcesses = async (req: Request, res: Response) => {
    try {
        const data = await ProcesoCompra.findAll({
            attributes: {
                exclude: ['provider_proc']
            },
            include: [
                {
                    association: 'provider',
                    attributes: ['name_pro']
                }
            ],
            raw: true,
            nest: true
        })

        if (data.length === 0) {
            throw new Error('No existen procesos de compra');
        }

        res.status(200).json({ data: data })
    } catch (error) {
        res.status(500).json({ message: (error as Error).message })
    }
}

const getComponentsPerType = async (req: Request, res: Response) => {
    try {
        const { type } = req.body

        const data = await ComponenteActivo.findAll({
            attributes: ['name_comp'],
            raw: true,
            where: {
                type_act_comp: type
            }
        })

        if (!data) {
            throw new Error('No existen componentes para ese tipo de activo');
        }

        res.status(200).json({ data: data })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: (error as Error).message })
    }
}

export {
    saveActive, getActive, getAllActives, getCategories, saveProcess, getLastIdProcess, getAllActivesPerUbication,
    getTypesPerCategory, getBrandsPerCategory, getLastIdActive, getTypes, getProcesses, deleteActive, deleteProcess,
    getComponentsPerType
}
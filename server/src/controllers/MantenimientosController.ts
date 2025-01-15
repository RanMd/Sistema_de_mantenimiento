import { Request, Response } from 'express';
import Mantenimiento from '../models/Mantenimiento';
import DetalleMantenimiento, { DetalleMantenimientoActividades, DetalleMantenimientoComponente } from '../models/DetalleMantenimiento';
import { Activo } from '../models/Activos';

const getLastIdMaintenance = async (req: Request, res: Response) => {
    try {
        const lastId = await Mantenimiento.max<number, Mantenimiento>('num_mant', {
            raw: true
        });
        if (!lastId) {
            res.status(200).json({ data: 0 });
            return;
        }

        res.status(200).json({ data: lastId });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: (error as Error).message });
    }
}

type MaintenanceToSave = {
    num_mant?: number,
    code_mant: string,
    type_attendant_mant: string,
    attendant_mant: string,
    date_end_mant: string | null,
    state_mant: string,
    actives: {
        id_act: number,
    }[],
}

type DetailsType = {
    id_act: number;
    state_act: string;
    activity_mant: string[];
    components: {
        name_comp: string;
        type_mant: string;
    }[];
}

const createMantenimiento = async (req: Request, res: Response): Promise<void> => {
    try {
        const { maintenance, detail } = req.body;

        const { code_mant, type_attendant_mant, attendant_mant, date_end_mant, state_mant, actives } = maintenance as MaintenanceToSave;

        const mant = await Mantenimiento.create({
            code_mant: code_mant,
            type_attendant_mant,
            attendant_mant,
            date_end_mant,
            state_mant,
        });

        const detailsAux: DetalleMantenimiento[] = [];

        actives.forEach(async (active: { id_act: number }) => {
            const detail = await DetalleMantenimiento.create({
                num_mant_per: mant.num_mant,
                id_act: active.id_act,
                state_act: 'Nuevo',
            });

            await Activo.update({
                in_maintenance: true,
            }, {
                where: {
                    id_act: active.id_act,
                }
            });
            detailsAux.push(detail);
        });

        if ((detail as DetailsType[]).length > 0) {
            const details = detail as DetailsType[];

            details.forEach(async (detail: DetailsType) => {
                const { id_act, state_act, activity_mant, components } = detail;

                const detailId = detailsAux.find((d) => d.id_act === id_act)?.id_detail;

                if (activity_mant.length > 0) {
                    activity_mant.forEach(async (activity) => {
                        await DetalleMantenimientoActividades.create({
                            id_detail_per: detailId,
                            activity_mant: activity,
                        });
                    });
                }

                if (components.length > 0) {
                    components.forEach(async (component) => {
                        await DetalleMantenimientoComponente.create({
                            id_detail_per: detailId,
                            name_comp_mant: component.name_comp,
                            type_mant: component.type_mant,
                        });
                    });
                }
                console.log(detail);

                await DetalleMantenimiento.update({
                    state_act,
                }, {
                    where: {
                        id_detail: detailId,
                    },
                });
            });
        }

        res.status(201);
    } catch (error) {
        res.status(500).json({ message: `Error al crear el mantenimiento: ${(error as Error).message}` + req.body.mantenance });
    }
};

const updateMantenimiento = async (req: Request, res: Response): Promise<void> => {
    try {
        const { mantenaince, detail } = req.body;

        const { num_mant, type_attendant_mant, attendant_mant, date_end_mant, state_mant } = mantenaince as MaintenanceToSave;

        await Mantenimiento.update({
            type_attendant_mant,
            attendant_mant,
            date_end_mant,
            state_mant,
        }, {
            where: {
                num_mant: num_mant,
            },
        });

        const detailsAux = await DetalleMantenimiento.findAll({
            where: {
                num_mant_per: num_mant,
            },
        });

        if (detail) {
            const details = detail as DetailsType[];

            details.forEach(async (detail: DetailsType) => {
                const { id_act, state_act, activity_mant, components } = detail;

                const detailId = detailsAux.find((d) => d.id_act === id_act)?.id_detail;

                if (activity_mant.length > 0) {
                    const existingActivities = await DetalleMantenimientoActividades.findAll({
                        where: {
                            id_detail_per: detailId,
                        },
                        attributes: { exclude: ['id_detail_per'] },
                    });

                    const activitiesAux = activity_mant.filter((activity) => {
                        return !existingActivities.some((existingActivity) => existingActivity.activity_act === activity);
                    });

                    activitiesAux.forEach(async (activity) => {
                        await DetalleMantenimientoActividades.create({
                            id_detail_per: detailId,
                            activity_mant: activity,
                        });
                    });
                }

                if (components.length > 0) {
                    const existingComponents = await DetalleMantenimientoComponente.findAll({
                        where: {
                            id_detail_per: detailId,
                        },
                        attributes: { exclude: ['id_detail_per'] },
                    });

                    const componentsAux = components.filter((component) => {
                        return !existingComponents.some((existingComponent) => existingComponent.name_comp_mant === component.name_comp);
                    });

                    componentsAux.forEach(async (component) => {
                        await DetalleMantenimientoComponente.create({
                            id_detail_per: detailId,
                            name_comp_mant: component.name_comp,
                            type_mant: component.type_mant,
                        });
                    });
                }

                await DetalleMantenimiento.update({
                    state_act,
                }, {
                    where: {
                        id_detail: detailId,
                    },
                });
            });
        }

        res.status(201);
    } catch (error) {
        res.status(500).json({ message: `Error al actualizar el mantenimiento: ${(error as Error).message}` });
    }
}

const getMantenimientos = async (req: Request, res: Response): Promise<void> => {
    try {
        const mantenimientos = await Mantenimiento.findAll();

        if (mantenimientos.length === 0) {
            res.status(404).json({ message: 'No se encontraron mantenimientos.' });
            return;
        }

        res.status(200).json({ data: mantenimientos });
    } catch (error) {
        res.status(500).json({ message: `Error al obtener los mantenimientos: ${(error as Error).message}` });
        console.log(error)
    }
};

const getMaintenance = async (req: Request, res: Response): Promise<void> => {
    try {
        const { num_mant } = req.body;

        const mantenimiento = await Mantenimiento.findByPk(num_mant);

        if (!mantenimiento) {
            res.status(404).json({ message: 'No se encontro el mantenimiento.' });
            return;
        }

        res.status(200).json({ data: mantenimiento });
    } catch (error) {
        res.status(500).json({ message: `Error al obtener el mantenimiento: ${(error as Error).message}` });
    }
}

const getDetailsReport = async (req: Request, res: Response): Promise<void> => {
    try {
        const { num_mant } = req.body;

        const detalles = await DetalleMantenimiento.findAll({
            where: {
                num_mant_per: num_mant,
            },
            attributes: [],
            include: [
                {
                    association: 'activo',
                    attributes: ['code_act', 'name_act']
                },
                {
                    association: 'actividades',
                    attributes: ['activity_act']
                },
                {
                    association: 'componentes',
                    attributes: ['name_comp_mant', 'type_mant']
                }
            ]
        });

        if (detalles.length === 0) {
            res.status(404).json({ message: 'No se encontraron detalles del mantenimiento.' });
            return;
        }

        res.status(200).json({ data: detalles });
    } catch (error) {
        res.status(500).json({ message: `Error al obtener los detalles del mantenimiento: ${(error as Error).message}` });
    }
}

const getDetailsUpdate = async (req: Request, res: Response): Promise<void> => {
    try {
        const { num_mant } = req.body;

        const detalles = await DetalleMantenimiento.findAll({
            where: {
                num_mant_per: num_mant,
            },
            attributes: [],
            include: [
                {
                    association: 'activo',
                    attributes: ['id_act', 'state_act']
                },
                {
                    association: 'actividades',
                    attributes: ['activity_act']
                },
                {
                    association: 'componentes',
                    attributes: ['name_comp_mant', 'type_mant']
                }
            ]
        });

        if (detalles.length === 0) {
            res.status(404).json({ message: 'No se encontraron detalles del mantenimiento.' });
            return;
        }

        const details = detalles.map((detalle) => {
            const { activo, actividades, componentes } = detalle as unknown as {
                activo: Activo,
                actividades: DetalleMantenimientoActividades[],
                componentes: DetalleMantenimientoComponente[]
            };

            const activities = actividades.map((activity) => activity.activity_act);
            const components = componentes.map((component) => {
                return {
                    name_comp: component.name_comp_mant,
                    type_mant: component.type_mant,
                }
            });

            return {
                id_act: activo.id_act,
                state_act: activo.state_act,
                activity_mant: activities,
                components,
            }
        });

        res.status(200).json({ data: details });
    } catch (error) {
        res.status(500).json({ message: `Error al obtener los detalles del mantenimiento: ${(error as Error).message}` });
    }
}

const getActivesPerMant = async (req: Request, res: Response): Promise<void> => {
    try {
        const { num_mant } = req.body;

        const detalles = await DetalleMantenimiento.findAll({
            where: {
                num_mant_per: num_mant,
            },
            attributes: [],
            include: [
                {
                    association: 'activo',
                }
            ]
        });

        if (detalles.length === 0) {
            res.status(404).json({ message: 'No se encontraron detalles del mantenimiento.' });
            return;
        }

        res.status(200).json({ data: detalles });
    } catch (error) {
        res.status(500).json({ message: `Error al obtener los detalles del mantenimiento: ${(error as Error).message}` });
    }
}

export { createMantenimiento, getMantenimientos, getLastIdMaintenance, updateMantenimiento, getMaintenance, getDetailsReport, getDetailsUpdate, getActivesPerMant };
import axios, { AxiosError } from 'axios';
import { ActiveToTable, Activo, ActivoToSave, ProcesoCompra, Ubicacion } from '../models/Active';
import { Process, Provider } from '../models/Process';
import { DetailsReportType, DetailsType, Maintenance, MaintenanceToSave } from '../models/Maintenance';

const api = 'http://localhost:3000/api/activos';

const saveActive = async (activo: ActivoToSave): Promise<{ success: boolean }> => {
    try {
        const res = await axios.post<{
            message?: string
        }>(`${api}/save`, activo);

        if (res.data.message) {
            throw new Error(res.data.message);
        }

        return { success: true };
    } catch (error) {
        console.error((error as AxiosError<{
            message: string
        }>).response?.data.message)
        return { success: false }
    }
}

const deleteActive = async (id_active: number): Promise<{ success: boolean }> => {
    try {
        const activeData = { id_active }

        const res = await axios.delete<{
            message?: string
        }>(`${api}/delete`, { data: activeData });

        if (res.data.message) { throw new Error(res.data.message) }

        return { success: true };
    } catch (error) {
        console.error((error as AxiosError<{
            message: string
        }>).response?.data.message)
        return { success: false }
    }
}

const deleteProcess = async (id_proc: number): Promise<{ success: boolean }> => {
    try {
        const processData = { id_proc }

        const res = await axios.delete<{
            message?: string
        }>(`${api}/deleteProcess`, { data: processData });

        if (res.data.message) { throw new Error(res.data.message) }

        return { success: true };
    } catch (error) {
        console.error((error as AxiosError<{
            message: string
        }>).response?.data.message)
        return { success: false }
    }
}

const getActives = async (): Promise<{ data: ActiveToTable[] }> => {
    try {
        const res = await axios.get<{
            data: Activo[],
            message?: string
        }>(`${api}/getAll`);

        if (res.data.message) { throw new Error(res.data.message) }

        const result: ActiveToTable[] = res.data.data.map((active) => {
            return {
                id: active.id_act,
                code: active.code_act,
                name: active.name_act,
                ubication: active.ubication.name_ubi,
                category: active.category.category_type,
                type: active.type_act,
                buyProcess: active.buy_process.code_proc
            }
        })

        return { data: result };
    } catch (error) {
        console.error((error as AxiosError<{
            message: string
        }>).response?.data.message)
        console.log(error)
        return { data: [] }
    }
}

const getActivesFree = async (): Promise<{ data: ActiveToTable[] }> => {
    try {
        const res = await axios.get<{
            data: Activo[],
            message?: string
        }>(`${api}/getAllFree`);

        if (res.data.message) { throw new Error(res.data.message) }

        const result: ActiveToTable[] = res.data.data.map((active) => {
            return {
                id: active.id_act,
                code: active.code_act,
                name: active.name_act,
                ubication: active.ubication.name_ubi,
                category: active.category.category_type,
                type: active.type_act,
                buyProcess: active.buy_process.code_proc
            }
        })

        return { data: result };
    } catch (error) {
        console.error((error as AxiosError<{
            message: string
        }>).response?.data.message)
        console.log(error)
        return { data: [] }
    }
}

const getActivesPerUbication = async (id_ubication: number): Promise<{ data: Activo[] }> => {
    try {
        const activeData = { id_ubication }

        const res = await axios.post<{
            data: Activo[],
            message?: string
        }>(`${api}/getActivesPerUbication`, activeData);

        if (res.data.message) { throw new Error(res.data.message) }

        return { data: res.data.data };
    } catch (error) {
        console.error((error as AxiosError<{
            message: string
        }>).response?.data.message)
        console.log(error)
        return { data: [] }
    }
}

const getActivo = async ({ id_activo }: { id_activo: number }): Promise<{ data: Activo | null }> => {
    try {
        const activeData = { id_activo }

        const res = await axios.post<{
            data: Activo,
            message?: string
        }>(`${api}/get`, activeData);

        if (res.data.message) {
            throw new Error(res.data.message);
        }

        return { data: res.data.data };
    } catch (error) {
        console.error((error as AxiosError<{
            message: string
        }>).response?.data.message)
        return { data: null }
    }
}

const getLastId = async (): Promise<{ data: number }> => {
    try {
        const res = await axios.get<{
            data: number,
            message?: string
        }>(`${api}/last`);

        if (res.data.message) {
            throw new Error(res.data.message);
        }

        return { data: res.data.data };
    } catch (error) {
        console.error((error as AxiosError<{
            message: string
        }>).response?.data.message)
        return { data: 0 }
    }
}

const getCategories = async (): Promise<{ data: string[] }> => {
    try {

        const res = await axios.get<{
            data: [{
                category: string
            }],
            message?: string
        }>(`${api}/categories`);

        if (res.data.message) {
            throw new Error(res.data.message);
        }

        const categories: string[] = res.data.data.map((item) => (
            item.category
        ))

        return { data: categories };
    } catch (error) {
        console.error((error as AxiosError<{
            message: string
        }>).response?.data.message)
        return { data: [] }
    }
}

const getTypes = async (): Promise<{ data: string[] }> => {
    try {
        const res = await axios.get<{
            data: [{ name_type: string }],
            message?: string
        }>(`${api}/typesAll`);

        if (res.data.message) {
            throw new Error(res.data.message);
        }

        const types: string[] = res.data.data.map((item) => (
            item.name_type
        ))

        return { data: types };
    } catch (error) {
        console.error((error as AxiosError<{
            message: string
        }>).response?.data.message)
        return { data: [] }
    }
}

const getTypesPerCategory = async (category: string): Promise<{ data: string[] }> => {
    try {
        const typeData = { category }

        const res = await axios.post<{
            data: [{ name_type: string }],
            message?: string
        }>(`${api}/types`, typeData);

        if (res.data.message) {
            throw new Error(res.data.message);
        }

        const types: string[] = res.data.data.map((item) => (
            item.name_type
        ))

        return { data: types };
    } catch (error) {
        console.error((error as AxiosError<{
            message: string
        }>).response?.data.message)
        return { data: [] }
    }
}

const getProcesses = async (): Promise<{ data: ProcesoCompra[] }> => {
    try {
        const res = await axios.get<{
            data: ProcesoCompra[],
            message?: string
        }>(`${api}/processes`);

        if (res.data.message) {
            throw new Error(res.data.message);
        }

        return { data: res.data.data };
    } catch (error) {
        console.error((error as AxiosError<{
            message: string
        }>).response?.data.message)
        return { data: [] }
    }
}

const getProcessesComplete = async (): Promise<{ data: Process[] }> => {
    try {
        const res = await axios.get<{
            data: Process[],
            message?: string
        }>(`${api}/processes`);

        if (res.data.message) {
            throw new Error(res.data.message);
        }

        return { data: res.data.data };
    } catch (error) {
        console.error((error as AxiosError<{
            message: string
        }>).response?.data.message)
        return { data: [] }
    }
}

const getBrandsPerCategory = async (category: string): Promise<{ data: string[] }> => {
    try {
        const brandData = { category }

        const res = await axios.post<{
            data: [{ name_fab: string }],
            message?: string
        }>(`${api}/brands`, brandData);

        if (res.data.message) {
            throw new Error(res.data.message);
        }

        const brands: string[] = res.data.data.map((item) => (
            item.name_fab
        ))

        return { data: brands };
    } catch (error) {
        console.error((error as AxiosError<{
            message: string
        }>).response?.data.message)
        return { data: [] }
    }
}

const getComponentsPerType = async (type: string): Promise<{ data: string[] }> => {
    try {
        const componentsData = { type }

        const res = await axios.post<{
            data: [{ name_comp: string }],
            message?: string
        }>(`${api}/getComponentsPerType`, componentsData);

        if (res.data.message) {
            throw new Error(res.data.message);
        }

        const components: string[] = res.data.data.map((item) => (
            item.name_comp
        ))

        return { data: components };
    } catch (error) {
        console.error((error as AxiosError<{
            message: string
        }>).response?.data.message)
        return { data: [] }
    }
}

const getComponentsPerActive = async (id_act: number): Promise<{
    data: {
        name_comp: string,
        state_component: string
    }[]
}> => {
    try {
        const activeData = { id_act }

        const res = await axios.post<{
            data: {
                name_comp: string,
                state_component: string
            }[],
            message?: string
        }>(`${api}/getComponentsPerActive`, activeData);

        if (res.data.message) {
            throw new Error(res.data.message);
        }

        return { data: res.data.data };
    } catch (error) {
        console.error((error as AxiosError<{
            message: string
        }>).response?.data.message)
        return { data: [] }
    }
}

// {
//     "data": [
//         {
//             "mantenimiento": {
//                 "code_mant": "MANT-0009",
//                 "state_mant": 1
//             }
//         }
//     ]
// }

const getMantenimientosPerActive = async (id_act: number): Promise<{
    data: {
        code_mant: string,
        state_mant: number
    }[]
}> => {
    try {
        const activeData = { id_act }

        const res = await axios.post<{
            data: [
                {
                    mantenimiento: {
                        code_mant: string,
                        state_mant: number
                    }
                }
            ],
            message?: string
        }>(`${api}/getMantenimientosPerActive`, activeData);

        if (res.data.message) {
            throw new Error(res.data.message);
        }

        const result = res.data.data.map((mantenimiento) => {
            return {
                code_mant: mantenimiento.mantenimiento.code_mant,
                state_mant: mantenimiento.mantenimiento.state_mant
            }
        })

        return { data: result };
    } catch (error) {
        console.error((error as AxiosError<{
            message: string
        }>).response?.data.message)
        return { data: [] }
    }
}

const apiUbi = 'http://localhost:3000/api/ubicaciones';

const getUbicaciones = async (): Promise<{ data: Ubicacion[] }> => {
    try {
        const res = await axios.get<{
            data: Ubicacion[],
            message?: string
        }>(`${apiUbi}/`);

        if (res.data.message) {
            throw new Error(res.data.message);
        }

        return { data: res.data.data };
    } catch (error) {
        console.error((error as AxiosError<{
            message: string
        }>).response?.data.message)
        return { data: [] }
    }
}

const saveProcess = async (code_proc: string, provider_proc: string): Promise<{ success: boolean }> => {
    try {
        const res = await axios.post<{
            message?: string
        }>(`${api}/saveProcess`, {
            code_proc,
            provider_proc
        });

        if (res.data.message) {
            throw new Error(res.data.message);
        }

        return { success: true };
    } catch (error) {
        console.error((error as AxiosError<{
            message: string
        }>).response?.data.message)
        return { success: false }
    }
}

const getLastIdProcess = async (): Promise<{ data: number }> => {
    try {
        const res = await axios.get<{
            data: number,
            message?: string
        }>(`${api}/lastIdProcess`);

        if (res.data.message) {
            throw new Error(res.data.message);
        }

        return { data: res.data.data };
    } catch (error) {
        console.error((error as AxiosError<{
            message: string
        }>).response?.data.message)
        return { data: 0 }
    }
}

const apiMant = 'http://localhost:3000/api/mantenimientos';

const getLastIdMaintenance = async (): Promise<{ data: number }> => {
    try {
        const res = await axios.get<{
            data: number,
            message?: string
        }>(`${apiMant}/getLastIdMaintenance`);

        if (res.data.message) {
            throw new Error(res.data.message);
        }

        return { data: res.data.data };
    } catch (error) {
        console.error((error as AxiosError<{
            message: string
        }>).response?.data.message)
        return { data: 0 }
    }
}

const saveMaintenance = async (maintenance: MaintenanceToSave, detail?: DetailsType[]): Promise<{ success: boolean }> => {
    try {
        const data = { maintenance, detail }

        const res = await axios.post<{
            message?: string
        }>(`${apiMant}/save`, data);

        if (res.data.message) {
            throw new Error(res.data.message);
        }

        return { success: true };
    } catch (error) {
        console.error((error as AxiosError<{
            message: string
        }>).response?.data.message)
        return { success: false }
    }
}

const getAllMaintenance = async (): Promise<{ data: Maintenance[] }> => {
    try {
        const res = await axios.get<{
            data: Maintenance[],
            message?: string
        }>(`${apiMant}/allMant`);

        if (res.data.message) {
            throw new Error(res.data.message);
        }

        return { data: res.data.data };
    } catch (error) {
        console.error((error as AxiosError<{
            message: string
        }>).response?.data.message)
        return { data: [] }
    }
}

const getMaintenance = async (num_mant: number): Promise<{ data: Maintenance | null }> => {
    try {
        const maintenanceData = { num_mant }

        const res = await axios.post<{
            data: Maintenance,
            message?: string
        }>(`${apiMant}/getOne`, maintenanceData);

        if (res.data.message) {
            throw new Error(res.data.message);
        }

        return { data: res.data.data };
    } catch (error) {
        console.error((error as AxiosError<{
            message: string
        }>).response?.data.message)
        return { data: null }
    }
}

const getDetailsReport = async (num_mant: number): Promise<{ data: DetailsReportType[] }> => {
    try {
        const maintenanceData = { num_mant }

        const res = await axios.post<{
            data: {
                activo: {
                    code_act: string,
                    name_act: string
                },
                actividades: {
                    activity_act: string
                }[],
                componentes: {
                    name_comp_mant: string,
                    type_mant: string
                }[]
            }[],

            message?: string
        }>(`${apiMant}/getDetailsReport`, maintenanceData);

        if (res.data.message) {
            throw new Error(res.data.message);
        }

        return { data: res.data.data };
    } catch (error) {
        console.error((error as AxiosError<{
            message: string
        }>).response?.data.message)
        return { data: [] }
    }
}

const getDetailsUpdate = async (num_mant: number): Promise<{ data: DetailsType[] }> => {
    try {
        const maintenanceData = { num_mant }

        const res = await axios.post<{
            data: DetailsType[],
            message?: string
        }>(`${apiMant}/getDetailsUpdate`, maintenanceData);

        if (res.data.message) {
            throw new Error(res.data.message);
        }

        return { data: res.data.data };
    } catch (error) {
        console.error((error as AxiosError<{
            message: string
        }>).response?.data.message)
        return { data: [] }
    }
}

const getActivesPerMant = async (num_mant: number): Promise<{ data: ActiveToTable[] }> => {
    try {
        const maintenanceData = { num_mant }

        const res = await axios.post<{
            data: {
                activo: Activo
            }[],
            message?: string
        }>(`${apiMant}/getActivesPerMant`, maintenanceData);

        if (res.data.message) {
            throw new Error(res.data.message);
        }

        const result: ActiveToTable[] = res.data.data.map((active) => {
            return {
                id: active.activo.id_act,
                code: active.activo.code_act,
                name: active.activo.name_act,
                type: active.activo.type_act,
                ubication: '',
                category: '',
                buyProcess: ''
            }
        })

        return { data: result };
    } catch (error) {
        console.error((error as AxiosError<{
            message: string
        }>).response?.data.message)
        return { data: [] }
    }
}

const apiProv = 'http://localhost:3000/api/proveedores';

const getProviders = async (): Promise<{ data: Provider[] }> => {
    try {
        const res = await axios.get<{
            data: Provider[],
            message?: string
        }>(`${apiProv}/`);

        if (res.data.message) {
            throw new Error(res.data.message);
        }

        return { data: res.data.data };
    } catch (error) {
        console.error((error as AxiosError<{
            message: string
        }>).response?.data.message)
        return { data: [] }
    }
}



export {
    getActivo, getCategories, getTypesPerCategory, getProcessesComplete, getProviders, getLastIdProcess, saveProcess, deleteProcess,
    getBrandsPerCategory, getUbicaciones, getLastId, saveActive, getActives, getTypes, getProcesses, deleteActive, getActivesPerUbication,
    getLastIdMaintenance, getComponentsPerType, getAllMaintenance, saveMaintenance, getMaintenance, getDetailsReport, getActivesFree, getDetailsUpdate, getActivesPerMant, getMantenimientosPerActive,
    getComponentsPerActive
};
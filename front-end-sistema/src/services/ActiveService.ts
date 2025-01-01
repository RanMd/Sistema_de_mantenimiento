import axios, { AxiosError } from 'axios';
import { ActiveToTable, Activo, ActivoToSave, ProcesoCompra, Ubicacion } from '../models/Active';
import { Process, Provider } from '../models/Process';

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
    getBrandsPerCategory, getUbicaciones, getLastId, saveActive, getActives, getTypes, getProcesses, deleteActive
};
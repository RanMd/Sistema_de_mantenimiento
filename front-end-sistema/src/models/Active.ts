type Activo = {
    id_act: number,
    name_act: string,
    code_act: string,
    state_act: string,
    brand_act: string,
    type_act: string,
    ubication: {
        name_ubi: string,
        floor_ubi: number,
        edificio: {
            name_edi: string
        }
    }
    category: {
        category_type: string
    }
    buy_process: {
        code_proc: string,
        date_proc: string,
    }
}

type Ubicacion = {
    id_ubi: number,
    name_ubi: string,
    floor_ubi: number,
    edificio: {
        name_edi: string
    }
}

type ProcesoCompra = {
    id_proc: number,
    code_proc: string,
}

type ActivoToSave = {
    name_act: string,
    code_act: string,
    ubication_act: number,
    brand_act: string,
    type_act: string,
    buy_process_act: string,
}

type ActiveToTable = {
    id: number;
    name: string;
    ubication: string;
    category: string;
    type: string;
    buyProcess: string;
};

export type { Activo, Ubicacion, ActivoToSave, ActiveToTable, ProcesoCompra };
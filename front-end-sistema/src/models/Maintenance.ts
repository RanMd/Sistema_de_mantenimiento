type Maintenance = {
    num_mant: number,
    code_mant: string,
    date_start_mant: string,
    date_end_mant: string | null,
    state_mant: number
    type_attendant_mant: string,
    attendant_mant: string,
}

type MaintenanceToSave = {
    num_mant: number,
    code_mant: string,
    type_attendant_mant: string,
    attendant_mant: string,
    date_end_mant: string | null,
    state_mant: number,
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

type DetailsReportType = {
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
}

export type { Maintenance, MaintenanceToSave, DetailsType, DetailsReportType };
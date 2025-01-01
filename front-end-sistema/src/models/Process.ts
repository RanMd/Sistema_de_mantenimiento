type Process = {
    id_proc: number,
    code_proc: string,
    date_proc: string,
    provider: {
        name_pro: string,
    }
}

type Provider = {
    id_pro: number,
    name_pro: string,
    address_pro: string,
}

export type { Process, Provider };
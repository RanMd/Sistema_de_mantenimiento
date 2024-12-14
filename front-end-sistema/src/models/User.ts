type UserToken = {
    id: number,
    rol: string,
    token: string
};

type User = {
    id: number,
    rol: string,
};

export type { User, UserToken }
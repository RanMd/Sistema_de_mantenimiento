import { UserToken } from '../models/User';
import axios from 'axios';

const api = 'http://localhost:3000/api';

const userNameApi = async ({ userName }: { userName: string }): Promise<{ exist: boolean }> => {
    try {
        const userData = {
            userName: userName
        }

        const { data } = await axios.post<{
            exist: boolean,
            message: string
        }>(`${api}/user`, userData);

        if (!data.exist) {
            throw new Error(data.message);
        }

        return { exist: true }
    } catch (error) {
        console.error(error);

        return { exist: false }
    }
}

const loginUserApi = async ({ userName, password }: { userName: string, password: string }): Promise<UserToken | null> => {
    try {
        const userData = {
            userName: userName,
            password: password
        }

        const { data } = await axios.post<UserToken>(`${api}/login`, userData);

        return data;
    } catch (error) {
        console.error(error);

        return null;
    }
}


export { userNameApi, loginUserApi };


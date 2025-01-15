import { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { loginUserApi, userNameApi } from '../services/AuthService';
import { User } from '../models/User'

type UserContextType = {
    user: User | null;
    token: string | null;
    searchUser: (userName: string) => Promise<boolean>;
    loginUser: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    isLogguedIn: () => boolean;
    hasAdminRol: boolean;
}

type AuthProviderProps = { children: ReactNode }

const UserContext = createContext<UserContextType>({} as UserContextType)

const AuthProvider = ({ children }: AuthProviderProps) => {
    const navigateTo = useNavigate();
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [hasAdminRol, setHasAdminRol] = useState<boolean>(false);

    useEffect(() => {
        const userInStorage = localStorage.getItem('user');
        const tokenInStorage = localStorage.getItem('token');

        if (userInStorage && tokenInStorage) {
            const userObject = JSON.parse(userInStorage) as User;
            setHasAdminRol(userObject.rol === 'A')
            setUser(userObject)
            setToken(tokenInStorage)
            navigateTo('/activos')
        }
    }, [setUser, setToken])

    const searchUser = async (userName: string): Promise<boolean> => {
        return await userNameApi({ userName })
            .then((res) => res.exist)
            .catch(() => false)
    }

    const loginUser = async (userName: string, password: string): Promise<boolean> => {
        return await loginUserApi({ userName, password })
            .then((res) => {
                if (res) {
                    localStorage.setItem('token', res.token)

                    const userObject = {
                        id: res.id,
                        rol: res.rol
                    } as User

                    localStorage.setItem('user', JSON.stringify(userObject))
                    setUser(userObject)
                    setToken(res.token)
                    setHasAdminRol(userObject.rol === 'A')  
                    navigateTo('/activos');
                }
                return !!res
            })
            .catch(() => false)
    }

    const isLogguedIn = () => !!user;

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
        setToken('')
        navigateTo('/')
    }


    return (
        <UserContext.Provider value={{ loginUser, isLogguedIn, logout, user, token, searchUser, hasAdminRol }} >
            {children}
        </UserContext.Provider>
    );
}
const useAuth = () => useContext(UserContext);

export { useAuth, AuthProvider } 
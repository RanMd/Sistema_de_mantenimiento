import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useField } from '../util/hooks/useField';
import { loginUserApi, userNameApi } from '../services/AuthService';

import BackgroundImg from '../assets/bg-img.svg'
import IconEdit from '../assets/icon-edit.svg'
import Input from '../components/Input'

import '../styles/App.css'

const UserForm = ({ handleUser }: {
    handleUser: (userName: string) => void
}) => {
    const userName = useField('text');
    const [userNotFound, setUserNotFound] = useState<boolean>(false);

    const searchUser = async (userName: string) => {
        const { exist } = await userNameApi({ userName });

        if (exist) {
            handleUser(userName);
        } else {
            setUserNotFound(true);
        }
    }

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        await searchUser(userName.value.toLocaleUpperCase());
    }

    return (
        <section>
            <h1>Iniciar Sesion</h1>
            <p>Ingresa tu usuario para continuar</p>
            <form onSubmit={onSubmit}>
                <Input
                    {...userName}
                    text='Usuario'
                    required
                    mayus
                />
                <button type='submit'>Continuar</button>
            </form>
            <div className="recommend">
                <div className="point"></div>
                <p>El usuario debe existir para continuar</p>
            </div>

            {userNotFound && (
                <div className="recommend error">
                    <div className="point"></div>
                    <p>El usuario no existe</p>
                </div>
            )}
        </section>
    )
}

const UserPass = ({ userName, handleEdit }: {
    userName: string,
    handleEdit: () => void
}) => {
    const userNameField = useField('text');
    const userPass = useField('text');
    const [userNotFound, setUserNotFound] = useState<boolean>(false);
    const nav = useNavigate();

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        loginUser(userName, userPass.value);
    }

    const loginUser = async (userName: string, password: string) => {
        const res = await loginUserApi({ userName: userName.toLocaleUpperCase(), password });

        if ('exist' in res && !res.exist) {
            setUserNotFound(true);
            return;
        }

        if ('token' in res) {
            localStorage.setItem('token', res.token);

            const userObject = {
                user: userName,
                rol: res.rol
            }

            localStorage.setItem('user', JSON.stringify(userObject));
            nav('/crear-activo');
        }
    }

    return (
        <section>
            <h1>Introduce tu contraseña</h1>
            <p>Ingresa tu contraseña para iniciar sesion</p>
            <form onSubmit={onSubmit}>
                <Input
                    {...userNameField}
                    disabled
                    value={userName}
                    icon={IconEdit}
                    handleIcon={handleEdit}
                />
                <Input
                    {...userPass}
                    text='Contraseña'
                    required
                />
                <button>Continuar</button>
            </form>
            <div className="recommend">
                <div className="point"></div>
                <p>Las credenciales deben coincidir</p>
            </div>

            {userNotFound && (
                <div className="recommend error">
                    <div className="point"></div>
                    <p>Contraseña incorrecta</p>
                </div>
            )}
        </section>
    )
}

const Login = () => {
    const [user, setUser] = useState<string>('');
    const nav = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (user && token) {
            setUser(user);
            nav('/crear-activo');
        }
    }, []);

    function handleUser(userName: string) {
        setUser(userName);
    }

    function handleEdit() {
        setUser('');
    }

    return (
        <>
            <aside className='background'>
                <img src={BackgroundImg} alt='imagen del background' />
            </aside>
            <main>
                <aside>
                    Sistema de mantenimiento
                </aside>
                {user === '' ? <UserForm handleUser={handleUser} /> : <UserPass userName={user} handleEdit={handleEdit} />}
            </main>
        </>
    )
}

export default Login

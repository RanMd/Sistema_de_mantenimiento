import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useField } from '../../util/hooks/useField';
import { loginUserApi } from '../../services/AuthService';
import { SearchingOverlay } from '../SearchingOverlay';
import { clsx } from 'clsx';

import iconEdit from '../../assets/icon-edit.svg'
import Input from '../Input';
import styles from '../../styles/modules/form.module.css'

const UserPass = ({ userName, handleEdit }: {
    userName: string,
    handleEdit: () => void
}) => {
    const [userNotFound, setUserNotFound] = useState<boolean>(false);
    const [searchingUser, setSearchingUser] = useState<boolean>(false);
    const userNameField = useField();
    const userPass = useField();
    const nav = useNavigate();

    const adviceClass = clsx(styles.advice, {
        [styles.error]: userNotFound,
        [styles.active]: userNotFound
    });

    const handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSearchingUser(true);
        loginUser(userName, userPass.value);
    }

    const loginUser = async (userName: string, password: string) => {
        const res = await loginUserApi({ userName: userName.toLocaleUpperCase(), password });

        setSearchingUser(false);

        if (!res) {
            setUserNotFound(true);
            return;
        }

        localStorage.setItem('token', res.token);

        const userObject = {
            user: userName,
            rol: res.rol
        }

        localStorage.setItem('user', JSON.stringify(userObject));
        nav('/crear-activo');
    }

    return (
        <section className={styles.formContainer}>
            <h1>Introduce tu contraseña</h1>
            <p>Ingresa tu contraseña para iniciar sesion</p>
            <form onSubmit={handleOnSubmit}>
                <Input
                    {...userNameField}
                    disabled
                    value={userName}
                    icon={iconEdit}
                    handleIcon={handleEdit}
                />
                <Input
                    {...userPass}
                    text='Contraseña'
                    required
                />
                <button>Continuar</button>
                {userNotFound && (
                    <div className={adviceClass}>
                        <div className={styles.point}></div>
                        <p>Contraseña incorrecta</p>
                    </div>
                )}
                {searchingUser && <SearchingOverlay />}
            </form>
            <div className={styles.advice}>
                <div className={styles.point}></div>
                <p>Las credenciales deben coincidir</p>
            </div>
        </section>
    )
}

export { UserPass };
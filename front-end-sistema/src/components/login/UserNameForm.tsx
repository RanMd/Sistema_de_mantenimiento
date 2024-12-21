import { FormEvent, useState } from 'react';
import { useField } from '../../util/hooks/useField';
import { userNameApi } from '../../services/AuthService';
import { SearchingOverlay } from '../SearchingOverlay';
import { clsx } from 'clsx';
import Input from '../Input';

import styles from '../../styles/modules/form.module.css'

const UserForm = ({ handleUser }: {
    handleUser: (userName: string) => void
}) => {
    const [userNotFound, setUserNotFound] = useState<boolean>(false);
    const [searchingUser, setSearchingUser] = useState<boolean>(false);
    const userName = useField();

    const adviceClass = clsx(styles.advice, {
        [styles.error]: userNotFound,
        [styles.active]: userNotFound
    });

    const handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSearchingUser(true);
        searchUser(userName.value);
    }

    const searchUser = async (userName: string) => {
        const { exist } = await userNameApi({ userName: userName.toLocaleUpperCase() });

        setSearchingUser(false);

        if (exist) {
            handleUser(userName);
        } else {
            setUserNotFound(true);
        }
    }

    return (
        <section className={styles.formContainer}>
            <h1>Iniciar Sesion</h1>
            <p>Ingresa tu usuario para continuar</p>
            <form onSubmit={handleOnSubmit}>
                <Input
                    {...userName}
                    text='Usuario'
                    required
                    mayus
                />
                <button type='submit'>Continuar</button>
                {userNotFound && (
                    <div className={adviceClass}>
                        <div className={styles.point}></div>
                        <p>El usuario no existe</p>
                    </div>
                )}
                {searchingUser && <SearchingOverlay />}
            </form>
            <div className={styles.advice}>
                <div className={styles.point}></div>
                <p>El usuario debe existir para continuar</p>
            </div>
        </section>
    )
}

export { UserForm };
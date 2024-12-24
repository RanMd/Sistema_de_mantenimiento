import { FormEvent, useState } from 'react';
import { useField } from '../../util/hooks/useField';
import { SearchingOverlay } from '../SearchingOverlay';
import { clsx } from 'clsx';
import { InputFloating } from '../Input';

import styles from '../../styles/modules/form.module.css'

const UserForm = ({ handleCredential, searchUserFunction }: {
    handleCredential: (credential: string) => void,
    searchUserFunction: (userName: string) => Promise<boolean>
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
        searchUser(userName.value);
    }

    const searchUser = async (userName: string) => {
        const userNameValue = userName.toLocaleUpperCase()
        setSearchingUser(true);

        const exist = await searchUserFunction(userNameValue)

        setSearchingUser(false);

        if (exist) handleCredential(userNameValue);
        else setUserNotFound(true);
    }

    return (
        <section className={styles.formContainer}>
            <h1>Iniciar Sesion</h1>
            <p>Ingresa tu usuario para continuar</p>
            <form onSubmit={handleOnSubmit}>
                <InputFloating
                    {...userName}
                    textFloating='Usuario'
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
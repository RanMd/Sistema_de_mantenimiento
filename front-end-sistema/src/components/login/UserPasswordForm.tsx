import { SearchingOverlay } from '../SearchingOverlay';
import { FormEvent, useState } from 'react';
import { useField } from '../../util/hooks/useField';
import { clsx } from 'clsx';

import iconEdit from '../../assets/icon-edit.svg'
import { InputFloatingWithIcon } from '../Input';
import styles from '../../styles/modules/form.module.css'

const UserPass = ({ userName, handleEdit, loginUserFunction }: {
    userName: string,
    handleEdit: () => void,
    loginUserFunction: (userName: string, password: string) => Promise<boolean>
}) => {
    const [userNotFound, setUserNotFound] = useState<boolean>(false);
    const [searchingUser, setSearchingUser] = useState<boolean>(false);
    const userNameField = useField();
    const userPass = useField();

    const adviceClass = clsx(styles.advice, {
        [styles.error]: userNotFound,
        [styles.active]: userNotFound
    });

    const handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        loginUser(userName, userPass.value);
    }

    const loginUser = async (userName: string, password: string) => {
        const userNameValue = userName.toLocaleUpperCase()
        setSearchingUser(true);
        
        const success = await loginUserFunction(userNameValue, password)
        
        setSearchingUser(false);
        
        if (!success) {
            setUserNotFound(true)
        }

    }

    return (
        <section className={styles.formContainer}>
            <h1>Introduce tu contraseña</h1>
            <p>Ingresa tu contraseña para iniciar sesion</p>
            <form onSubmit={handleOnSubmit}>
                <InputFloatingWithIcon
                    {...userNameField}
                    disabled
                    value={userName}
                    icon={iconEdit}
                    handleIcon={handleEdit}
                />
                <InputFloatingWithIcon
                    {...userPass}
                    textFloating='Contraseña'
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
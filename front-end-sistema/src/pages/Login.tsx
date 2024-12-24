import { useState } from 'react';
import { UserForm } from '../components/login/UserNameForm';
import { UserPass } from '../components/login/UserPasswordForm';
import { useAuth } from '../context/useAuth';

import backgroundImg from '../assets/bg-img.svg'

import styles from '../styles/modules/login.module.css'

const Login = () => {
    const [credential, setCredential] = useState<string | null>(null);
    const { searchUser, loginUser } = useAuth();

    function handleCredential(credential: string) {
        setCredential(credential);
    }

    function handleEdit() {
        setCredential(null);
    }

    return (
        <div className={styles.loginContainer}>
            <aside className={styles.background}>
                <img src={backgroundImg} alt='imagen del background' />
            </aside>
            <main>
                <aside>Sistema de mantenimiento</aside>
                {!credential
                    ? <UserForm
                        handleCredential={handleCredential}
                        searchUserFunction={searchUser}
                    />
                    : <UserPass userName={credential!} handleEdit={handleEdit} loginUserFunction={loginUser} />
                }
            </main>
        </div>
    )
}

export default Login

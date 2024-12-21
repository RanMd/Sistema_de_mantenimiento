import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserForm } from '../components/login/UserNameForm';
import { UserPass } from '../components/login/UserPasswordForm';

import backgroundImg from '../assets/bg-img.svg'

import styles from '../styles/modules/login.module.css'

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
        <div className={styles.loginContainer}>
            <aside className={styles.background}>
                <img src={backgroundImg} alt='imagen del background' />
            </aside>
            <main>
                <aside>Sistema de mantenimiento</aside>
                {user === '' ? <UserForm handleUser={handleUser} /> : <UserPass userName={user} handleEdit={handleEdit} />}
            </main>
        </div>
    )
}

export default Login

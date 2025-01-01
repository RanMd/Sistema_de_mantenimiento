import { FC, useState, useEffect, useCallback, JSX } from 'react';
import { getLastIdProcess, getProviders, saveProcess } from '../services/ActiveService';
import { ComboBoxInput } from './Input';
import { Provider } from '../models/Process';
import styles from '../styles/modules/modal.module.css';
import clsx from 'clsx';

interface ModalCrearProviderProps {
    isOpen: boolean;
    setIsOpen: ((isOpen: boolean) => void) | null;
}

const ModalCrearProvider: FC<ModalCrearProviderProps> = ({ isOpen, setIsOpen }) => {
    const [providers, setProviders] = useState<Provider[]>([])
    const [lastId, setLastId] = useState<string>('');

    const [processCode, setProcessCode] = useState<string>('');
    const [providerProcess, setProviderProcess] = useState<number>(0);

    const [message, setMessage] = useState<JSX.Element | null>(null);

    const codeClass = clsx(styles.detail, styles.detailReadOnly);

    // Fetchs

    const fetchProviders = useCallback(async () => {
        const { data } = await getProviders();

        setProviders(data)
    }, [])

    const fetchLastId = useCallback(async () => {
        const { data } = await getLastIdProcess();

        const lastId = (data + 1).toString();

        setLastId(lastId);
    }, [])

    // Handlers

    const handleClose = useCallback(() => {
        if (setIsOpen) {
            setIsOpen(false);
        }
    }, [setIsOpen])

    const handleProvider = (value: Provider) => {
        setProviderProcess(value.id_pro);
        console.log(value)
    }

    const handleSubmit = async () => {
        if (providerProcess === 0) {
            createMessage(true, 'Seleccione un proveedor antes de guardar');
            return;
        }

        const { success } = await saveProcess(processCode, providerProcess.toString());

        if (success) {
            createMessage(false, 'Proceso de compra creado con éxito');
        } else {
            createMessage(true, 'Error al crear el proceso de compra');
        }
    }

    // Create Code

    useEffect(() => {
        fetchProviders();
        fetchLastId();

        const code = `PR${lastId.padStart(4, '0')}`;
        setProcessCode(code);
    }, [fetchLastId, fetchProviders, lastId])

    const createMessage = (isError: boolean, message: string) => {
        const messageClass = clsx(styles.sectionPart, styles.sectionMessage, isError ? styles.sectionError : styles.sectionSuccess);
        const messageSection = (
            <section className={messageClass}>
                <span>{message}</span>
            </section>
        )
        setMessage(messageSection);
    }

    return (
        <dialog
            className={styles.dialog}
            open={isOpen}
        >
            <div className={styles.modalContent}>
                <button className={styles.closeIcon} onClick={handleClose}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                    </svg>
                </button>
                <section className={styles.sectionPart}>
                    <header className={styles.modalHeader}>
                        <h2>Crear Proceso de compra</h2>
                        <p>
                            Complete los detalles del proceso en el formulario a continuación.
                            Asegúrese de que toda la información sea precisa antes de enviarla.
                        </p>
                    </header>
                    {message}
                    <div className={styles.mainSection}>
                        <div className={styles.groupInfo}>
                            <span className={styles.infoLabel}>Código del proceso</span>
                            <span className={codeClass}>{processCode}</span>
                        </div>
                        <div className={styles.groupInfo}>
                            <span className={styles.infoLabel}></span>
                            <ComboBoxInput
                                setOption={(value) => console.log(value)}
                                placeholder='Seleccione un proveedor'
                                className={styles.comboBox}
                            >
                                <span>Ninguna</span>
                                {providers.map((provider, index) => (
                                    <span
                                        key={index}
                                        // onClick={() => handleProvider(provider)}
                                        onClick={() => console.log(provider)}
                                    >
                                        {provider.name_pro}
                                    </span>
                                ))}
                            </ComboBoxInput>
                        </div>
                    </div>
                </section>
                <footer>
                    <button
                        className='primary-button'
                        onClick={() => handleSubmit()}
                    >
                        Guardar
                    </button>
                </footer>
            </div>
        </dialog>
    )
}

export { ModalCrearProvider }